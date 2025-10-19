import mongoose from 'mongoose';
import Job from '../models/jobModel.js';
import Internship from '../models/internshipModel.js';
import Webinar from '../models/webinarModel.js';
import dotenv from 'dotenv';

dotenv.config();

const clearOldData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear old sample data
    await Job.deleteMany({});
    await Internship.deleteMany({});
    await Webinar.deleteMany({});

    console.log('SUCCESS: Old data cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Error clearing data:', error);
    process.exit(1);
  }
};

clearOldData();