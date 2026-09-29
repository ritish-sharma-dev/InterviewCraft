import express from 'express';
import { protectRoute } from '../middleware/protect.route.js';
import {
    createSession,
    endSession,
    getMyRecentSessions,
    getSessionById,
    joinSession,
    selectQuestion,
    updateCandidateCode,
} from '../controllers/session.controller.js';

const router = express.Router();

router.post('/', protectRoute, createSession);
router.get('/my-recent', protectRoute, getMyRecentSessions);

router.get('/:id', protectRoute, getSessionById);
router.post('/:id/join', protectRoute, joinSession);
router.patch('/:id/question', protectRoute, selectQuestion);
router.put('/:id/code', protectRoute, updateCandidateCode);
router.post('/:id/end', protectRoute, endSession);

export default router;
