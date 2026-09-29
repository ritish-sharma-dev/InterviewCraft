import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV } from '../lib/env.js';
import { upsertStreamUser } from '../lib/stream.js';

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
});

const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
});

const createAuthCookie = (res, userId) => {
    const token = jwt.sign({}, ENV.JWT_SECRET, { subject: userId, expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: COOKIE_MAX_AGE });
};

export async function register(req, res) {
    try {
        const body = req.body ?? {};
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = body.password;

        if (name.length < 1 || name.length > 80) {
            return res.status(400).json({ message: 'Please enter your name' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email' });
        }
        if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
            return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
        }

        if (await User.exists({ email })) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const user = new User({
            name,
            email,
            passwordHash: await bcrypt.hash(password, 12),
        });
        user.streamId = user._id.toString();
        await user.save();
        await upsertStreamUser({ id: user.streamId, name: user.name, image: user.profileImage });

        createAuthCookie(res, user._id.toString());
        return res.status(201).json({ user: publicUser(user) });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email is already registered' });
        }
        console.error('Error registering user:', error.message);
        return res.status(500).json({ message: 'Unable to create account right now' });
    }
}

export async function login(req, res) {
    try {
        const body = req.body ?? {};
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = body.password;
        if (!email || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        createAuthCookie(res, user._id.toString());
        return res.status(200).json({ user: publicUser(user) });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        return res.status(500).json({ message: 'Unable to sign in right now' });
    }
}

export function logout(req, res) {
    res.clearCookie(COOKIE_NAME, cookieOptions());
    return res.status(200).json({ message: 'Signed out' });
}

export function getCurrentUser(req, res) {
    return res.status(200).json({ user: publicUser(req.user) });
}