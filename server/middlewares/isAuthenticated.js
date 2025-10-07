// middlewares/isAuthenticated.js (CONFIRMED CORRECT)
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; // <--- Reads from HTTP-Only Cookie
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    
    // Use the secret key from your environment
    const decode = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key'); 
    
    // If decoding fails (expired/invalid), the catch block handles the 401
    
    req.id = decode.userId; // Set user ID on request
    next();
  } catch (error) {
    // This catches JWT errors like 'TokenExpiredError' or 'JsonWebTokenError'
    console.error('Authentication Error:', error.message);
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
      success: false,
    });
  }
};
export default isAuthenticated;