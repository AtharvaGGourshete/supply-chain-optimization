import jwt from "jsonwebtoken";
import User from "../models/users.js";

const isAuthenticated = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header first (Bearer token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Fallback to cookie
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authenticated. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Not authenticated. Invalid token." });
        }

        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }
        res.status(500).json({ success: false, message: "Authentication error." });
    }
};

export default isAuthenticated;