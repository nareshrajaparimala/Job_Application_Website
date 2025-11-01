// Importing necessary modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importing custom modules
import connectDB from './config/db.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import webinarRoutes from './routes/webinarRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import resumeUploadRoutes from './routes/resumeUploadRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import govExamRoutes from './routes/govExamRoutes.js';
import admissionCardRoutes from './routes/admissionCardRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Import and start cleanup scheduler
import { startCleanupScheduler } from './utils/cleanupService.js';
startCleanupScheduler();

// Initialize Express app
const app = express();

// Middleware configuration
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(cors({
  origin: ['https://mytechz.in', 'https://www.mytechz.in', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/resume-upload', resumeUploadRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/gov-exams', govExamRoutes);
app.use('/api/admission-cards', admissionCardRoutes);
app.use('/api/facility', facilityRoutes);

// Start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*

/api/resume/templates
Available endpoints:
id- Naresh@mytechz.in
pass- admin123

- POST /api/auth/login
- POST /api/auth/register
- POST /api/colleges/apply

*/