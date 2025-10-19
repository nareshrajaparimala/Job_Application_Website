import Job from '../models/jobModel.js';
import Internship from '../models/internshipModel.js';
import Webinar from '../models/webinarModel.js';
import College from '../models/collegeModel.js';

// ========== JOBS ==========
export const addJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json({ success: true, message: 'Job added successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 50, category } = req.query;
    const query = category ? { category } : {};
    const jobs = await Job.find(query)
      .select('title company location salary category createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    const total = await Job.countDocuments(query);
    res.json({ success: true, data: jobs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job updated successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ========== INTERNSHIPS ==========
export const addInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.json({ success: true, message: 'Internship added successfully', data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getInternships = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const internships = await Internship.find()
      .select('title company location duration stipend datePosted')
      .sort({ datePosted: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    const total = await Internship.countDocuments();
    res.json({ success: true, data: internships, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
    res.json({ success: true, message: 'Internship updated successfully', data: internship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ========== WEBINARS ==========
export const addWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.create(req.body);
    res.json({ success: true, message: 'Webinar added successfully', data: webinar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getWebinars = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const webinars = await Webinar.find()
      .select('title speaker organization date time price datePosted')
      .sort({ datePosted: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    const total = await Webinar.countDocuments();
    res.json({ success: true, data: webinars, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    res.json({ success: true, message: 'Webinar updated successfully', data: webinar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByIdAndDelete(req.params.id);
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    res.json({ success: true, message: 'Webinar deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ========== COLLEGES ==========
export const addCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.json({ success: true, message: 'College added successfully', data: college });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getColleges = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const colleges = await College.find()
      .select('name location type fees createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    const total = await College.countDocuments();
    res.json({ success: true, data: colleges, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, message: 'College updated successfully', data: college });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, message: 'College deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ========== BULK OPERATIONS ==========
export const addContent = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    let result;
    switch (type) {
      case 'job':
        result = await Job.create(data);
        break;
      case 'internship':
        result = await Internship.create(data);
        break;
      case 'webinar':
        result = await Webinar.create(data);
        break;
      case 'college':
        result = await College.create(data);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }
    
    res.json({ success: true, message: `${type} added successfully`, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const bulkDelete = async (req, res) => {
  try {
    const { type, ids } = req.body;
    
    let result;
    switch (type) {
      case 'jobs':
        result = await Job.deleteMany({ _id: { $in: ids } });
        break;
      case 'internships':
        result = await Internship.deleteMany({ _id: { $in: ids } });
        break;
      case 'webinars':
        result = await Webinar.deleteMany({ _id: { $in: ids } });
        break;
      case 'colleges':
        result = await College.deleteMany({ _id: { $in: ids } });
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }
    
    res.json({ success: true, message: `${result.deletedCount} ${type} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};