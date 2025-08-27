import express from 'express';
import { addJob, getJobs, deleteJob, addContent, getInternships, getWebinars, getColleges } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/jobs', authenticateToken, requireAdmin, addJob);
router.get('/jobs', authenticateToken, requireAdmin, getJobs);
router.delete('/jobs/:id', authenticateToken, requireAdmin, deleteJob);
router.post('/content', authenticateToken, requireAdmin, addContent);
router.get('/internships', getInternships);
router.get('/webinars', getWebinars);
router.get('/colleges', getColleges);

export default router;