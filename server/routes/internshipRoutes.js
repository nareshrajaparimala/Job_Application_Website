import express from 'express';
import { applyToInternship, shareInternship, getInternshipByShareId } from '../controllers/internshipController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', authenticateToken, applyToInternship);
router.post('/share', shareInternship);
router.get('/share/:shareId', getInternshipByShareId);

export default router;