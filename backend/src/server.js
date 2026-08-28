import express from 'express';
import cors from 'cors';
import { ENV } from './lib/env.js';

import path from 'path';

import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';

import { connectDB } from './lib/db.js';

const app = express();
const __dirname = path.resolve();

// MIDDLEWARES
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use('/api/inngest', serve({ client: inngest, functions }));

// API CHECK ROUTE
app.get('/api/check', (req, res) => {
    res.status(200).json({ msg: 'API is up and running' });
});

// MAKE APP READY FOR DEPLOYMENT
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

// SERVER START
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT || 3000, () =>
            console.log('Server is running on port: ', ENV.PORT),
        );
    } catch (error) {
        console.log('Error starting server: ', error);
    }
};

startServer();
