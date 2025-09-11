import express from 'express';
import { 
  getTemplates, 
  submitResumeApplication, 
  manageTemplate, 
  deleteTemplate,
  getResumeApplications,
  updateApplicationStatus
} from '../controllers/resumeController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/templates', getTemplates);

// User routes
router.post('/apply', authenticateToken, submitResumeApplication);

// Admin routes
router.get('/applications', authenticateToken, requireAdmin, getResumeApplications);
router.post('/templates', authenticateToken, requireAdmin, manageTemplate);
router.put('/templates/:id', authenticateToken, requireAdmin, manageTemplate);
router.delete('/templates/:id', authenticateToken, requireAdmin, deleteTemplate);
router.put('/applications/:id/status', authenticateToken, requireAdmin, updateApplicationStatus);

export default router;