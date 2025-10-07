// routes/auth.js (UPDATED)
import express from "express";
import { getUserProfile, login, logout, register } from "../controllers/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerValidation, loginValidation } from "../middlewares/validation.js"; // Assuming your validation file is correct

const router = express.Router();

// Public Routes
router.route("/register").post(registerValidation, register); // Added validation
router.route("/login").post(loginValidation, login); 
router.route("/logout").get(logout);

// Protected Routes (Uses the cookie-based auth middleware)
router.route("/profile").get(isAuthenticated, getUserProfile); 

export default router;