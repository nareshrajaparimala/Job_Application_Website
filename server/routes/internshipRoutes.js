import express from 'express';
import { applyToInternship } from '../controllers/internshipController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', authenticateToken, applyToInternship);

export default router;