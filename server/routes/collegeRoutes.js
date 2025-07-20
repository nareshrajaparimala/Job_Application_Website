import express from 'express';
import { getColleges, applyToCollege } from '../controllers/collegeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getColleges);
router.post('/apply', protect, applyToCollege);

export default router;
