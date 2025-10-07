// controllers/authController.js (UPDATED)
import User from "../models/users.js";
import { generateToken } from "../utils/jwt.js"; // Corrected import (generateToken is a named export)
import { validationResult} from "express-validator";

// Helper function to set the cookie
const sendTokenResponse = (user, statusCode, message, res) => {
    // Generate JWT token
    const token = generateToken({ userId: user._id });

    // Cookie options for HTTP-Only token
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // 7 days from .env
        httpOnly: true, // Essential for security
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'Lax', // Good default for CSRF protection
    };

    // Remove password from response
    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Assuming you might have roles later
        // ... add other user fields you want on the frontend
    };

    // Set the cookie and send the JSON response
    res.status(statusCode)
        .cookie('token', token, options) // <--- SET HTTP-ONLY COOKIE HERE
        .json({
            success: true,
            message,
            user: userResponse,
        });
};

// Register user
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({ name, email, password });

        // Use the helper to set cookie and send response
        sendTokenResponse(user, 201, 'User registered successfully', res); 

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Use the helper to set cookie and send response
        sendTokenResponse(user, 200, 'Login successful', res);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Logout user
export const logout = (req, res) => {
    // Clear the HTTP-Only cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expire immediately (10s buffer)
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};

// Get User Profile (protected by isAuthenticated middleware)
export const getUserProfile = async (req,res) => {
    try {
        // req.id is set by the isAuthenticated middleware
        const userId = req.id; 
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user // The profile endpoint returns the user object directly under 'user' key
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}