import express from 'express';
import { 
  addJob, getJobs, deleteJob, updateJob,
  addInternship, getInternships, deleteInternship, updateInternship,
  addWebinar, getWebinars, deleteWebinar, updateWebinar,
  addCollege, getColleges, deleteCollege, updateCollege,
  addContent, bulkDelete
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Jobs
router.post('/jobs', authenticateToken, requireAdmin, addJob);
router.get('/jobs', authenticateToken, requireAdmin, getJobs);
router.put('/jobs/:id', authenticateToken, requireAdmin, updateJob);
router.delete('/jobs/:id', authenticateToken, requireAdmin, deleteJob);

// Internships
router.post('/internships', authenticateToken, requireAdmin, addInternship);
router.get('/internships', authenticateToken, requireAdmin, getInternships);
router.put('/internships/:id', authenticateToken, requireAdmin, updateInternship);
router.delete('/internships/:id', authenticateToken, requireAdmin, deleteInternship);

// Webinars
router.post('/webinars', authenticateToken, requireAdmin, addWebinar);
router.get('/webinars', authenticateToken, requireAdmin, getWebinars);
router.put('/webinars/:id', authenticateToken, requireAdmin, updateWebinar);
router.delete('/webinars/:id', authenticateToken, requireAdmin, deleteWebinar);

// Colleges
router.post('/colleges', authenticateToken, requireAdmin, addCollege);
router.get('/colleges', authenticateToken, requireAdmin, getColleges);
router.put('/colleges/:id', authenticateToken, requireAdmin, updateCollege);
router.delete('/colleges/:id', authenticateToken, requireAdmin, deleteCollege);

// Bulk operations
router.post('/content', authenticateToken, requireAdmin, addContent);
router.delete('/bulk-delete', authenticateToken, requireAdmin, bulkDelete);

export default router;