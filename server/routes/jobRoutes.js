import express from 'express';
// import { createJob, getJobs } from '../controllers/jobController.js';
import  {protect}  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create',protect );
router.get('/list',protect );

export default router;