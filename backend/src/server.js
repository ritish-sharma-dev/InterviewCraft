import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

import chatRoutes from './routes/chat.route.js';
import authRoutes from './routes/auth.route.js';
import sessionRoutes from './routes/session.route.js';

const app = express();
const __dirname = path.resolve();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
if (ENV.NODE_ENV !== 'production') {
    app.use(cors({ origin: ENV.CLIENT_URL || 'http://localhost:5173', credentials: true }));
}
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);

// API CHECK ROUTE
app.get('/api/check', (req, res) => {
    res.status(200).json({ msg: 'API is up and running' });
});

// MAKE APP READY FOR DEPLOYMENT
if (ENV.NODE_ENV === 'production') {
    app.use(express.static('../frontend/dist'));

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.resolve('../frontend/dist/index.html'));
    });
}

// SERVER START
const startServer = async () => {
    try {
        if (!ENV.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
        await connectDB();
        app.listen(ENV.PORT || 3000, () => console.log('Server is running on port: ', ENV.PORT));
    } catch (error) {
        console.log('Error starting server: ', error);
    }
};

startServer();
