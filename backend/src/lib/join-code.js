import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const JOIN_CODE_LENGTH = 8;

export function generateJoinCode() {
    return Array.from({ length: JOIN_CODE_LENGTH }, () =>
        JOIN_CODE_ALPHABET[randomInt(JOIN_CODE_ALPHABET.length)],
    ).join('');
}

export function createJoinCodeHash(code, salt = randomBytes(16).toString('hex')) {
    const normalizedCode = code.trim().toUpperCase();
    const hash = createHash('sha256').update(`${salt}:${normalizedCode}`).digest('hex');

    return { hash, salt };
}

export function verifyJoinCode(code, hash, salt) {
    if (!code || !hash || !salt) return false;

    const candidate = createJoinCodeHash(code, salt).hash;
    const candidateBuffer = Buffer.from(candidate, 'hex');
    const storedBuffer = Buffer.from(hash, 'hex');

    return (
        candidateBuffer.length === storedBuffer.length &&
        timingSafeEqual(candidateBuffer, storedBuffer)
    );
}
