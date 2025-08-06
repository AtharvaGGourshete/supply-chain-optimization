// routes/auth.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validation.js";
import { authenticateToken } from "../middlewares/auth.js";

// Create the router instance - this was missing!
const router = express.Router();
router.post("/register", registerValidation, register);
router.post("/login", login);
export default router;
