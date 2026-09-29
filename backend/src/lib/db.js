import mongoose from 'mongoose';

import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if (!ENV.DB_URL) throw new Error("DB URL not defined");
        const connect = await mongoose.connect(ENV.DB_URL);
        const users = mongoose.connection.collection('users');
        let indexes = [];
        try {
            indexes = await users.indexes();
        } catch (error) {
            if (error.code !== 26) throw error;
        }
        const legacyIdIndex = indexes.find((index) => index.key?.clerkId);
        if (legacyIdIndex) await users.dropIndex(legacyIdIndex.name);

        await users.updateMany(
            { streamId: { $exists: false }, clerkId: { $exists: true } },
            [{ $set: { streamId: '$clerkId' } }, { $unset: 'clerkId' }],
        );
        await users.updateMany(
            { streamId: { $exists: false } },
            [{ $set: { streamId: { $toString: '$_id' } } }],
        );
        console.log("Connected to MongoDB: ", connect.connection.host);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}