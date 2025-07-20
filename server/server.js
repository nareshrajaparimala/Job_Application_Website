import express from 'express';
import dotenv from 'dotenv';
import connectDB  from './config/db.js';
import jobRoutes  from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Or specify your frontend ngrok domain for more security
  credentials: true
}));
app.use(express.json()); // parse JSON

app.get('/', (req, res) => {
    res.send('API is running...');
});
// app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
/api/auth/login
/api/auth/register
*/
