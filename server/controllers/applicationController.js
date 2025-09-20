import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';

// Get user's applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const applications = await Application.find({ userId })
      .populate('jobId', 'title company location salary')
      .sort({ appliedDate: -1 });

    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobTitle: app.jobId?.title || 'Job Title Not Available',
      company: app.jobId?.company || 'Company Not Available',
      location: app.jobId?.location || 'Location Not Available',
      salary: app.jobId?.salary || 'Salary Not Disclosed',
      status: app.status,
      appliedDate: app.appliedDate,
      adminNote: app.adminNote,
      interviewDate: app.interviewDate
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    // Check if user already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      userId,
      jobId,
      status: 'pending',
      appliedDate: new Date()
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNote, interviewDate } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { 
        status, 
        adminNote,
        interviewDate: interviewDate ? new Date(interviewDate) : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application updated successfully', application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications (Admin only)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'firstName lastName email')
      .populate('jobId', 'title company location salary')
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};