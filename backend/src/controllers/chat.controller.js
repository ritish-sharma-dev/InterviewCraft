import { chatClient } from '../lib/stream.js';
import Session from '../models/session.model.js';

export async function getStreamToken(req, res) {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);

        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.status !== 'active') {
            return res.status(403).json({ message: 'Session is no longer active' });
        }

        const isMember =
            session.host.toString() === req.user._id.toString() ||
            session.participant?.toString() === req.user._id.toString();

        if (!isMember) return res.status(403).json({ message: 'Session membership required' });

        const userId = req.user.streamId || req.user._id.toString();
        const token = chatClient.createToken(userId);

        res.status(200).json({
            token,
            userId,
            userName: req.user.name,
            userImage: req.user.profileImage,
        });
    } catch (error) {
        console.log('Error in getStreamToken controller:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
