import express from 'express';
import { registerForWebinar, shareWebinar, getWebinarByShareId } from '../controllers/webinarController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, registerForWebinar);
router.post('/share', shareWebinar);
router.get('/share/:shareId', getWebinarByShareId);

export default router;