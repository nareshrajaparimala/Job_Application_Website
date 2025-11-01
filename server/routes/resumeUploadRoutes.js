import express from 'express';
import { 
  upload,
  uploadResume, 
  getResumeInfo, 
  downloadResume, 
  deleteResume,
  getAllUsersWithResumes,
  adminDownloadResume
} from '../controllers/resumeUploadController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/upload', authenticateToken, upload.single('resume'), uploadResume);
router.get('/info', authenticateToken, getResumeInfo);
router.get('/download', authenticateToken, downloadResume);
router.delete('/delete', authenticateToken, deleteResume);

// Admin routes
router.get('/admin/all-users', authenticateToken, requireAdmin, getAllUsersWithResumes);
router.get('/admin/download/:userId', authenticateToken, requireAdmin, adminDownloadResume);

export default router;