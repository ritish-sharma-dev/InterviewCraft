import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        problem: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
        },
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
        callId: {
            type: String,
            default: '',
        },
        joinCodeHash: {
            type: String,
            required: true,
            select: false,
        },
        joinCodeSalt: {
            type: String,
            required: true,
            select: false,
        },
        locked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
