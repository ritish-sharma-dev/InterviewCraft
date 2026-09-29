import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        profileImage: {
            type: String,
            default: '',
        },
        passwordHash: {
            type: String,
            select: false,
        },
        streamId: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
