// path: server/controllers/authController.js

import User from "../models/users.js";
import { generateToken } from "../utils/jwt.js";
import { validationResult } from "express-validator";

// Helper function to generate token and set the HTTP-Only cookie
const sendTokenResponse = (user, statusCode, message, res) => {
    const token = generateToken({ userId: user._id });

    const options = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true, // Prevents client-side script access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    };

    // Prepare user object for the response, excluding the password
    const userResponse = { id: user._id, name: user.name, email: user.email };
    
    // Set the cookie named 'token' and send the response
    res.status(statusCode)
       .cookie('token', token, options)
       .json({ success: true, message, user: userResponse });
};

// Register a new user
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email, password });
        sendTokenResponse(user, 201, 'User registered successfully', res); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Login an existing user
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password'); // Explicitly include password for comparison

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, 'Login successful', res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Logout user
export const logout = (req, res) => {
    // Clear the cookie by setting its expiration to a past date
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000), // 5 seconds
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
};

// Get the current user's profile
export const getUserProfile = async (req, res) => {
    try {
        // req.user is attached by the isAuthenticated middleware
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        
        // The frontend expects the user object directly, not nested under a 'user' key for this route.
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to load user profile" });
    }
};
