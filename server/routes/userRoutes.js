import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Defines the GET endpoint for /api/users/profile
router.get('/profile', isAuthenticated, getUserProfile);

export default router;
