// Importing necessary modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importing custom modules
import connectDB from './config/db.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

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
// app.use('/api/jobs', jobRoutes); // Uncomment if job routes are needed

// Start the server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
Available endpoints:
- POST /api/auth/login
- POST /api/auth/register
- POST /api/colleges/apply

*/