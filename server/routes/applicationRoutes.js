import express from 'express';
import { 
  getMyApplications, 
  applyForJob, 
  updateApplicationStatus, 
  getAllApplications 
} from '../controllers/applicationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.get('/my-applications', protect, getMyApplications);
router.post('/apply', protect, applyForJob);

// Admin routes
router.get('/all', protect, adminOnly, getAllApplications);
router.put('/:applicationId/status', protect, adminOnly, updateApplicationStatus);

export default router;