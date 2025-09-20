import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';
import ResumeApplication from '../models/resumeApplicationModel.js';

// Admin Dashboard Data
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    const applications = await Application.find()
      .populate('userId', 'firstName lastName email phone')
      .sort({ appliedDate: -1 });
    
    let resumeApplications = [];
    try {
      resumeApplications = await ResumeApplication.find()
        .populate('userId', 'firstName lastName email phone')
        .populate('templateId', 'name price')
        .sort({ createdAt: -1 });
    } catch (resumeError) {
      console.log('Resume applications not available:', resumeError.message);
    }

    res.json({
      stats: { 
        totalUsers, 
        totalApplications: totalApplications + resumeApplications.length, 
        pendingApplications: pendingApplications + resumeApplications.filter(app => app.status === 'pending').length
      },
      users,
      applications,
      resumeApplications
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Dashboard Data
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get both college and job applications
    const collegeApplications = await Application.find({ 
      userId, 
      applicationType: { $in: ['college', undefined] } // undefined for backward compatibility
    });
    
    const jobApplications = await Application.find({ 
      userId, 
      applicationType: 'job'
    });
    
    const allApplications = [...collegeApplications, ...jobApplications];
    
    const stats = {
      total: allApplications.length,
      pending: allApplications.filter(app => app.status === 'pending').length,
      approved: allApplications.filter(app => app.status === 'approved').length,
      rejected: allApplications.filter(app => app.status === 'rejected').length
    };

    res.json({ 
      applications: collegeApplications, // Keep college applications for backward compatibility
      jobApplications,
      stats 
    });
  } catch (error) {
    console.error('Dashboard error:', error);
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