import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import Internship from '../models/internshipModel.js';
import Webinar from '../models/webinarModel.js';

// Get user's applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const applications = await Application.find({ 
      userId, 
      applicationType: 'job' 
    }).sort({ appliedDate: -1 });

    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobTitle: app.jobTitle || 'Job Title Not Available',
      company: app.company || 'Company Not Available',
      location: app.location || 'Location Not Available',
      salary: app.salary || 'Salary Not Disclosed',
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
    const { jobId, jobTitle, company, location, salary } = req.body;
    const userId = req.user.id;
    
    console.log('Job application request:', { jobId, jobTitle, company, location, salary, userId });

    // Check if user already applied (only if jobId is provided)
    if (jobId) {
      const existingApplication = await Application.findOne({ userId, jobId, applicationType: 'job' });
      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }
    }

    // Get user details
    const User = (await import('../models/userModel.js')).default;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use job details from frontend request or set defaults
    const jobDetails = {
      title: jobTitle || 'Job Application',
      company: company || 'Company Not Specified',
      location: location || 'Location Not Specified',
      salary: salary || 'Salary Not Disclosed'
    };
    
    // Validate required fields
    if (!jobDetails.title || !jobDetails.company) {
      return res.status(400).json({ message: 'Job title and company are required' });
    }
    
    console.log('Applying for job with details:', jobDetails);

    const application = new Application({
      userId,
      jobId: jobId || `job_${Date.now()}`,
      jobTitle: jobDetails.title,
      company: jobDetails.company,
      location: jobDetails.location,
      salary: jobDetails.salary,
      applicationType: 'job',
      status: 'pending',
      appliedDate: new Date()
    });

    await application.save();

    // Send email notification
    try {
      const { sendEmail } = await import('../utils/emailService.js');
      
      const emailSubject = `New Job Application - ${jobDetails.title}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Job Application</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">MytechZ Job Portal</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Job Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr style="background: white;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Job Title:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${jobDetails.title}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Company:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${jobDetails.company}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${jobDetails.location}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Salary:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${jobDetails.salary}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Applied Date:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Application ID:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${application._id}</td>
              </tr>
            </table>
            
            <h2 style="color: #333; margin-bottom: 20px;">Applicant Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: white;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.firstName} ${user.lastName}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.email}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.phone || 'Not provided'}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Gender:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.gender || 'Not specified'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 14px;">This application was submitted through MytechZ Job Portal</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Please review and update the application status in the admin dashboard</p>
          </div>
        </div>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@mytechz.in',
        emailSubject,
        emailBody
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    
    // Send more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate application detected' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const applications = await Application.find({ applicationType: 'job' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ appliedDate: -1 });

    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobTitle: app.jobTitle,
      company: app.company,
      location: app.location,
      salary: app.salary,
      status: app.status,
      appliedDate: app.appliedDate,
      adminNote: app.adminNote,
      interviewDate: app.interviewDate,
      user: {
        name: `${app.userId.firstName} ${app.userId.lastName}`,
        email: app.userId.email,
        phone: app.userId.phone
      }
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns the application or is admin
    if (application.userId.toString() !== userId && userRole !== 'admin' && req.user.id !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(applicationId);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get jobs for public access
export const getJobs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get internships for public access
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ datePosted: -1 }).lean();
    res.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get webinars for public access
export const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ datePosted: -1 }).lean();
    res.json(webinars);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific job by ID
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).lean();
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific internship by ID
export const getInternshipById = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const internship = await Internship.findById(internshipId).lean();
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    
    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};