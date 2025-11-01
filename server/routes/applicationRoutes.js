import express from 'express';
import { 
  getMyApplications, 
  applyForJob, 
  updateApplicationStatus, 
  getAllApplications,
  deleteApplication,
  getJobs,
  getInternships,
  getWebinars,
  getJobById,
  getInternshipById
} from '../controllers/applicationController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for fetching content
router.get('/jobs', getJobs);
router.get('/jobs/:jobId', getJobById);
router.get('/internships', getInternships);
router.get('/internships/:internshipId', getInternshipById);
router.get('/webinars', getWebinars);

// User routes
router.get('/my-applications', authenticateToken, getMyApplications);
router.post('/apply', authenticateToken, applyForJob);

// Admin routes
router.get('/all', authenticateToken, requireAdmin, getAllApplications);
router.put('/:applicationId/status', authenticateToken, requireAdmin, updateApplicationStatus);

// Delete route (both user and admin)
router.delete('/:applicationId', authenticateToken, deleteApplication);

export default router;