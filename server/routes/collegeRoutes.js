import express from 'express';
import { applyToCollege } from '../controllers/collegeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', authenticateToken, applyToCollege);

export default router;