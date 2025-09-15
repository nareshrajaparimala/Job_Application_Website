import express from 'express';
import {
  submitPortfolioRequest,
  getUserPortfolioRequests,
  getAllPortfolioRequests,
  updatePortfolioRequestStatus
} from '../controllers/portfolioController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/User routes
router.post('/submit', submitPortfolioRequest);

// Protected user routes
router.get('/user-requests', protect, getUserPortfolioRequests);

// Admin routes
router.get('/admin/all-requests', protect, requireAdmin, getAllPortfolioRequests);
router.put('/admin/update-status/:requestId', protect, requireAdmin, updatePortfolioRequestStatus);

export default router;