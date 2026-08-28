import express from 'express';
import cors from 'cors';
import { ENV } from './lib/env.js';

import { serve } from 'inngest/express';
import { inngest, functions } from './lib/inngest.js';

import { connectDB } from './lib/db.js';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use('/api/inngest', serve({ client: inngest, functions }));

// API CHECK ROUTE
app.get('/api/check', (req, res) => {
    res.status(200).json({ msg: 'api is up and running' });
});

// SERVER START
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () =>
            console.log('Server is running on port: ', ENV.PORT),
        );
    } catch (error) {
        console.log('Error starting server: ', error);
    }
};

startServer();
