import Job from '../models/jobModel.js';
import Internship from '../models/internshipModel.js';
import Webinar from '../models/webinarModel.js';
import College from '../models/collegeModel.js';

// Add new job
export const addJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: 'Job added successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add content
export const addContent = async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log('Adding content:', type, data);
    
    let result;
    switch (type) {
      case 'job':
        result = new Job(data);
        await result.save();
        break;
      case 'internship':
        result = new Internship(data);
        await result.save();
        break;
      case 'webinar':
        result = new Webinar(data);
        await result.save();
        break;
      case 'college':
        result = new College(data);
        await result.save();
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }
    
    res.json({ message: `${type} added successfully`, result });
  } catch (error) {
    console.error('Add content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get internships
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ datePosted: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get webinars
export const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ datePosted: -1 });
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};