import express from 'express';
import { registerForWebinar } from '../controllers/webinarController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerForWebinar);

export default router;