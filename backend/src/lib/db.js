import mongoose from 'mongoose';

import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if (!ENV.DB_URL) throw new Error("DB URL not defined");
        const connect = await mongoose.connect(ENV.DB_URL);
        console.log("Connected to MongoDB: ", connect.connection.host);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}