import express from 'express';
import { 
  createAdmissionCard, 
  getAdmissionCards, 
  getAdmissionCardByShareId, 
  shareAdmissionCard, 
  updateAdmissionCard, 
  deleteAdmissionCard 
} from '../controllers/admissionCardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createAdmissionCard);
router.get('/my-cards', authenticateToken, getAdmissionCards);
router.get('/share/:shareId', getAdmissionCardByShareId);
router.post('/share', shareAdmissionCard);
router.put('/update/:cardId', authenticateToken, updateAdmissionCard);
router.delete('/delete/:cardId', authenticateToken, deleteAdmissionCard);

export default router;