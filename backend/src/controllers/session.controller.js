import { chatClient, streamClient } from '../lib/stream.js';
import { createJoinCodeHash, generateJoinCode, verifyJoinCode } from '../lib/join-code.js';
import Session from '../models/session.model.js';

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if (!problem || !difficulty) {
            return res.status(400).json({ message: 'Problem and difficulty are required' });
        }

        // generate a unique call id for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const joinCode = generateJoinCode();
        const { hash: joinCodeHash, salt: joinCodeSalt } = createJoinCodeHash(joinCode);

        // create session in db
        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId,
            joinCodeHash,
            joinCodeSalt,
        });

        // create stream video call
        await streamClient.video.call('default', callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {
                    problem,
                    difficulty,
                    sessionId: session._id.toString(),
                },
            },
        });

        // chat messaging
        const channel = chatClient.channel('messaging', callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId],
        });

        await channel.create();

        res.status(201).json({ session, joinCode });
    } catch (error) {
        console.log('Error in createSession controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getActiveSessions(_, res) {
    try {
        const sessions = await Session.find({ status: 'active', locked: false })
            .populate('host', 'name profileImage email clerkId')
            .populate('participant', 'name profileImage email clerkId')
            .select('-callId -joinCodeHash -joinCodeSalt')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log('Error in getActiveSessions controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id;

        // get sessions where user is either host or participant
        const sessions = await Session.find({
            status: 'completed',
            $or: [{ host: userId }, { participant: userId }],
        })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log('Error in getMyRecentSessions controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params;

        const session = await Session.findById(id)
            .populate('host', 'name email profileImage clerkId')
            .populate('participant', 'name email profileImage clerkId');

        if (!session) return res.status(404).json({ message: 'Session not found' });

        const isMember =
            session.host._id.toString() === req.user._id.toString() ||
            session.participant?._id.toString() === req.user._id.toString();
        const sessionData = session.toObject();

        if (!isMember) delete sessionData.callId;

        res.status(200).json({ session: sessionData });
    } catch (error) {
        console.log('Error in getSessionById controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function joinSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id).select('+joinCodeHash +joinCodeSalt');

        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (session.status !== 'active') {
            return res.status(400).json({ message: 'Cannot join a completed session' });
        }

        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({
                message: 'Host cannot join their own session as participant',
            });
        }

        if (session.participant?.toString() === userId.toString()) {
            const sessionData = session.toObject();
            delete sessionData.joinCodeHash;
            delete sessionData.joinCodeSalt;
            return res.status(200).json({ session: sessionData });
        }

        if (!req.body.joinCode) {
            return res.status(400).json({ message: 'A session join code is required' });
        }

        if (!verifyJoinCode(req.body.joinCode, session.joinCodeHash, session.joinCodeSalt)) {
            return res.status(403).json({ message: 'Invalid session join code' });
        }

        const joinedSession = await Session.findOneAndUpdate(
            {
                _id: id,
                status: 'active',
                locked: false,
                participant: null,
            },
            { $set: { participant: userId } },
            { new: true },
        );

        if (!joinedSession) {
            return res.status(409).json({ message: 'Session is full or no longer joinable' });
        }

        const channel = chatClient.channel('messaging', joinedSession.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({ session: joinedSession });
    } catch (error) {
        console.log('Error in joinSession controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: 'Session not found' });

        // check if user is the host
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Only the host can end the session' });
        }

        // check if session is already completed
        if (session.status === 'completed') {
            return res.status(400).json({ message: 'Session is already completed' });
        }

        // delete stream video call
        const call = streamClient.video.call('default', session.callId);
        await call.delete({ hard: true });

        // delete stream chat channel
        const channel = chatClient.channel('messaging', session.callId);
        await channel.delete();

        session.status = 'completed';
        await session.save();

        res.status(200).json({
            session,
            message: 'Session ended successfully',
        });
    } catch (error) {
        console.log('Error in endSession controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
