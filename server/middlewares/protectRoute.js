// path: server/middlewares/protectRoute.js

import jwt from 'jsonwebtoken';
import User from '../models/users.js';

export const protectRoute = async (req, res, next) => {
    try {
        // --- THE FIX ---
        // Changed `req.cookies.jwt` to `req.cookies.token` to match what authController sets.
        const token = req.cookies.token; 

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Find the user based on the ID from the token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // --- SECOND FIX ---
        // Attach the entire user object to the request, as forecastController expects it.
        req.user = user; 

        next(); // Proceed to the next step

    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
