import express from 'express';
import { 
  submitFacilityRequest, 
  getUserFacilityRequests, 
  getAllFacilityRequests, 
  updateFacilityRequestStatus 
} from '../controllers/facilityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/request', authenticateToken, submitFacilityRequest);
router.get('/my-requests', authenticateToken, getUserFacilityRequests);

// Admin routes
router.get('/all-requests', authenticateToken, getAllFacilityRequests);
router.put('/update-status/:requestId', authenticateToken, updateFacilityRequestStatus);

export default router;