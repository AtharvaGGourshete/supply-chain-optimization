// path: server/utils/jwt.js

import jwt from "jsonwebtoken";

// It's a good practice to pull these from your .env file
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15d';

/**
 * Generates a JSON Web Token.
 * @param {object} payload - The payload to include in the token (e.g., { userId: '123' }).
 * @returns {string} The generated JWT.
 */
export const generateToken = (payload) => {
    // Check if the JWT_SECRET is set, which is critical for security.
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JSON Web Token.
 * @param {string} token - The JWT to verify.
 * @returns {object} The decoded payload if the token is valid.
 * @throws {Error} Throws an error if the token is invalid or expired.
 */
export const verifyToken = (token) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        // This will catch errors like 'TokenExpiredError' or 'JsonWebTokenError'
        // and allow the calling function (your middleware) to handle them.
        throw error;
    }
};
