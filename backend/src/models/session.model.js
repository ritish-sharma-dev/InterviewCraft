import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 80,
        },
        problem: {
            type: String,
            default: null,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: null,
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
        visibility: {
            type: String,
            enum: ['private'],
            default: 'private',
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
            required: false,
            select: false,
        },
        joinCodeSalt: {
            type: String,
            required: false,
            select: false,
        },
        locked: {
            type: Boolean,
            default: false,
        },
        activeQuestionId: {
            type: String,
            default: null,
        },
        askedQuestionIds: {
            type: [String],
            default: [],
        },
        questionRevision: {
            type: Number,
            default: 0,
        },
        candidateCode: {
            type: String,
            default: '',
            maxlength: 50000,
        },
        candidateLanguage: {
            type: String,
            enum: ['javascript', 'python', 'java'],
            default: 'javascript',
        },
        candidateCodeVersion: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
