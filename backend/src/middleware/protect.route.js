import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV } from '../lib/env.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.auth_token;

        if (!token) return res.status(401).json({ message: 'Authentication required' });

        const payload = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(payload.sub);

        if (!user) return res.status(401).json({ message: 'Session expired' });

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired' });
        }
        console.error('Error in protectRoute middleware', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
