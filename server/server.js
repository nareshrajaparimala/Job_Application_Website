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
import portfolioRoutes from './routes/portfolioRoutes.js';

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
app.use(cors({
  origin: '*', // Replace '*' with specific frontend domain for better security
  credentials: true
}));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
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
app.use('/api/portfolio', portfolioRoutes);

// Start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
Available endpoints:
id- admin@hireloop.com
pass- admin123

- POST /api/auth/login
- POST /api/auth/register
- POST /api/colleges/apply

*/