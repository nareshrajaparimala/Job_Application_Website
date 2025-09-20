import Job from '../models/Job.js';
import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, jobTitle, company, userEmail, userName, userPhone } = req.body;
    const userId = req.user.id;

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create application record
    const application = new Application({
      userId,
      jobId,
      jobTitle: jobTitle || 'Job Title',
      company: company || 'Company',
      location: 'Location Not Specified',
      salary: 'Not Disclosed',
      status: 'pending',
      appliedDate: new Date()
    });

    await application.save();

    // Send email notification to admin
    const emailSubject = `🔔 New Job Application - ${jobTitle}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚀 New Job Application</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">MytechZ Job Portal</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">📋 Job Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Job Title:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${jobTitle}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Company:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${company}</td>
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
          
          <h2 style="color: #333; margin-bottom: 20px;">👤 Applicant Details</h2>
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
          <p style="margin: 0; font-size: 14px;">📧 This application was submitted through MytechZ Job Portal</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Please review and update the application status in the admin dashboard</p>
        </div>
      </div>
    `;

    // Send email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@mytechz.in',
        subject: emailSubject,
        html: emailBody
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the application if email fails
    }

    res.status(200).json({ 
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error in job application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};