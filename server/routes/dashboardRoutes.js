import express from 'express';
import { getAdminDashboard, getUserDashboard, updateApplicationStatus } from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', authenticateToken, requireAdmin, getAdminDashboard);
router.get('/user', authenticateToken, getUserDashboard);
router.put('/application-status', authenticateToken, requireAdmin, updateApplicationStatus);

export default router;