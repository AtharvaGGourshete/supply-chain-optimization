// path: server/controllers/authController.js

import User from "../models/users.js";
import { generateToken } from "../utils/jwt.js";
import { validationResult } from "express-validator";

// Helper function to generate token and set the HTTP-Only cookie
const sendTokenResponse = (user, statusCode, message, res) => {
    const token = generateToken({ userId: user._id });
    const userResponse = { id: user._id, name: user.name, email: user.email };
    
    // Send token in response body instead of cookie
    res.status(statusCode).json({ 
        success: true, 
        message, 
        user: userResponse,
        token  // ← send token here
    });
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
        console.log(res)
        sendTokenResponse(user, 200, 'Login successful', res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
        console.log(res)
    }
};

// Logout user
export const logout = (req, res) => {
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
