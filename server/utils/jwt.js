// utils/jwt.js
import jwt from "jsonwebtoken"; // Fixed typo: was "jasonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload) => { // Changed to ES module export
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => { // Changed to ES module export
    return jwt.verify(token, JWT_SECRET);
};

export default generateToken;
