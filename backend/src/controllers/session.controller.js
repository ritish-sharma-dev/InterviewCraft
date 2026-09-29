import { chatClient, streamClient } from '../lib/stream.js';
import { createJoinCodeHash, generateJoinCode, verifyJoinCode } from '../lib/join-code.js';
import { getInterviewQuestion } from '../lib/question-catalog.js';
import Session from '../models/session.model.js';

export async function createSession(req, res) {
    let operation = 'save session';
    try {
        const { name } = req.body ?? {};
        const userId = req.user._id;
        const streamId = req.user.streamId || req.user._id.toString();

        const sessionName = typeof name === 'string' ? name.trim() : '';
        if (sessionName.length < 3 || sessionName.length > 80) {
            return res.status(400).json({ message: 'Session name must be between 3 and 80 characters' });
        }
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const joinCode = generateJoinCode();
        const joinCodeData = createJoinCodeHash(joinCode);

        const session = await Session.create({
            name: sessionName,
            problem: null,
            difficulty: null,
            host: userId,
            callId,
            ...(joinCodeData.hash ? {
                joinCodeHash: joinCodeData.hash,
                joinCodeSalt: joinCodeData.salt,
            } : {}),
            activeQuestionId: null,
            askedQuestionIds: [],
            questionRevision: 0,
        });

        operation = 'create video call';
        await streamClient.video.call('default', callId).getOrCreate({
            data: {
                created_by_id: streamId,
                custom: {
                    name: sessionName,
                    problem: null,
                    difficulty: null,
                    sessionId: session._id.toString(),
                },
            },
        });

        operation = 'create chat channel';
        const channel = chatClient.channel('messaging', callId, {
            name: sessionName,
            created_by_id: streamId,
            members: [streamId],
        });
        await channel.create();

        res.status(201).json({ session, joinCode });
    } catch (error) {
        console.error('Error in createSession controller:', {
            operation,
            name: error.name,
            message: error.message,
            status: error.status ?? error.statusCode ?? error.response?.status,
            code: error.code,
            details: error.response?.data,
        });
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id;
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
            .populate('host', 'name email profileImage')
            .populate('participant', 'name email profileImage');

        if (!session) return res.status(404).json({ message: 'Session not found' });

        const isMember =
            session.host._id.toString() === req.user._id.toString() ||
            session.participant?._id.toString() === req.user._id.toString();
        const sessionData = session.toObject();

        if (!isMember) {
            delete sessionData.callId;
            delete sessionData.candidateCode;
            delete sessionData.candidateLanguage;
        }

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
        const streamId = req.user.streamId || req.user._id.toString();
        const session = await Session.findById(id).select('+joinCodeHash +joinCodeSalt');

        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.status !== 'active') {
            return res.status(400).json({ message: 'Cannot join a completed session' });
        }
        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Host cannot join their own session as participant' });
        }
        if (session.participant?.toString() === userId.toString()) {
            const sessionData = session.toObject();
            delete sessionData.joinCodeHash;
            delete sessionData.joinCodeSalt;
            return res.status(200).json({ session: sessionData });
        }
        const joinCode = req.body?.joinCode;
        if (typeof joinCode !== 'string' || !joinCode.trim()) {
            return res.status(400).json({ message: 'A session join code is required' });
        }
        if (!verifyJoinCode(joinCode, session.joinCodeHash, session.joinCodeSalt)) {
            return res.status(403).json({ message: 'Invalid or expired session code' });
        }

        const joinedSession = await Session.findOneAndUpdate(
            { _id: id, status: 'active', locked: false, participant: null },
            { $set: { participant: userId } },
            { new: true },
        );

        if (!joinedSession) {
            return res.status(409).json({ message: 'Session is full or no longer joinable' });
        }

        const channel = chatClient.channel('messaging', joinedSession.callId);
        await channel.addMembers([streamId]);

        res.status(200).json({ session: joinedSession });
    } catch (error) {
        console.log('Error in joinSession controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function selectQuestion(req, res) {
    try {
        const { id } = req.params;
        const { questionId } = req.body;
        const question = getInterviewQuestion(questionId);

        if (!question) return res.status(400).json({ message: 'Invalid interview question' });

        const session = await Session.findOneAndUpdate(
            { _id: id, host: req.user._id, status: 'active' },
            {
                $set: {
                    activeQuestionId: questionId,
                    problem: question.title,
                    difficulty: question.difficulty,
                    candidateCode: '',
                    candidateLanguage: 'javascript',
                    candidateCodeVersion: 0,
                },
                $addToSet: { askedQuestionIds: questionId },
                $inc: { questionRevision: 1 },
            },
            { new: true },
        )
            .populate('host', 'name email profileImage')
            .populate('participant', 'name email profileImage');

        if (!session) {
            const existingSession = await Session.findById(id).select('host status');
            if (!existingSession) return res.status(404).json({ message: 'Session not found' });
            if (existingSession.host.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Only the interviewer can select questions' });
            }
            if (existingSession.status !== 'active') {
                return res.status(409).json({ message: 'Question selection is locked' });
            }
            return res.status(409).json({ message: 'Question selection could not be completed' });
        }

        try {
            const channel = chatClient.channel('messaging', session.callId);
            await channel.sendEvent({
                type: 'question.updated',
                questionId,
                problem: question.title,
                difficulty: question.difficulty,
                askedQuestionIds: session.askedQuestionIds,
                questionRevision: session.questionRevision,
                candidateCode: '',
                candidateLanguage: 'javascript',
                candidateCodeVersion: 0,
            });
        } catch (error) {
            console.warn('Question saved but broadcast failed:', error.message);
        }

        res.status(200).json({ session });
    } catch (error) {
        console.log('Error in selectQuestion controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateCandidateCode(req, res) {
    try {
        const { id } = req.params;
        const { code, language, questionRevision, codeVersion } = req.body;

        if (typeof code !== 'string' || code.length > 50000) {
            return res.status(400).json({ message: 'Code must be a string under 50,000 characters' });
        }
        if (!['javascript', 'python', 'java'].includes(language)) {
            return res.status(400).json({ message: 'Unsupported programming language' });
        }
        if (!Number.isInteger(questionRevision) || questionRevision < 0) {
            return res.status(400).json({ message: 'Invalid question revision' });
        }
        if (!Number.isInteger(codeVersion) || codeVersion < 1) {
            return res.status(400).json({ message: 'Invalid code version' });
        }

        const session = await Session.findOneAndUpdate(
            {
                _id: id,
                participant: req.user._id,
                status: 'active',
                questionRevision,
                candidateCodeVersion: { $lt: codeVersion },
            },
            {
                $set: {
                    candidateCode: code,
                    candidateLanguage: language,
                    candidateCodeVersion: codeVersion,
                },
            },
            { new: true, runValidators: true },
        ).select('callId candidateCode candidateLanguage questionRevision candidateCodeVersion');

        if (!session) {
            const existingSession = await Session.findById(id)
                .select('participant status questionRevision candidateCodeVersion');
            if (!existingSession) return res.status(404).json({ message: 'Session not found' });
            if (existingSession.participant?.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Only the candidate can update interview code' });
            }
            if (existingSession.status !== 'active') {
                return res.status(409).json({ message: 'This interview session has ended' });
            }
            return res.status(409).json({
                message: existingSession.questionRevision !== questionRevision
                    ? 'The question changed; reload the current editor state'
                    : 'A newer code update has already been saved',
            });
        }

        try {
            const channel = chatClient.channel('messaging', session.callId);
            await channel.sendEvent({
                type: 'candidate.code.updated',
                questionRevision: session.questionRevision,
                codeVersion: session.candidateCodeVersion,
            });
        } catch (error) {
            console.warn('Candidate code saved but broadcast failed:', error.message);
        }

        res.status(200).json({
            candidateCode: session.candidateCode,
            candidateLanguage: session.candidateLanguage,
            questionRevision: session.questionRevision,
            candidateCodeVersion: session.candidateCodeVersion,
        });
    } catch (error) {
        console.log('Error in updateCandidateCode controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Only the host can end the session' });
        }
        if (session.status === 'completed') {
            return res.status(400).json({ message: 'Session is already completed' });
        }

        const call = streamClient.video.call('default', session.callId);
        await call.delete({ hard: true });

        const channel = chatClient.channel('messaging', session.callId);
        await channel.delete();

        session.status = 'completed';
        session.visibility = 'private';
        await session.save();

        res.status(200).json({ session, message: 'Session ended successfully' });
    } catch (error) {
        console.log('Error in endSession controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
