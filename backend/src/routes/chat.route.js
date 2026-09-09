import express from 'express';
import { getStreamToken } from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/protect.route.js';

const router = express.Router();

router.get('/token', protectRoute, getStreamToken);

export default router;