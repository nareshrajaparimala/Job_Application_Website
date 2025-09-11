import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';
import ResumeApplication from '../models/resumeApplicationModel.js';

// Admin Dashboard Data
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    
    const users = await User.find({ role: 'user' }).select('-password');
    const applications = await Application.find().populate('userId', 'firstName lastName email phone');
    const resumeApplications = await ResumeApplication.find()
      .populate('userId', 'firstName lastName email phone')
      .populate('templateId', 'name price');

    res.json({
      stats: { 
        totalUsers, 
        totalApplications: totalApplications + await ResumeApplication.countDocuments(), 
        pendingApplications: pendingApplications + await ResumeApplication.countDocuments({ status: 'pending' })
      },
      users,
      applications,
      resumeApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Dashboard Data
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId });
    
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    res.json({ applications, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Application Status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'firstName lastName email');
    
    res.json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};