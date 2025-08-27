import Job from '../models/Job.js';
import { sendEmail } from '../utils/sendEmail.js';

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, jobTitle, company, userEmail, userName, userPhone } = req.body;
    const userId = req.user.id;

    // Send email notification
    const emailSubject = `New Job Application - ${jobTitle}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Job Application</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Job Details</h2>
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
          </table>
          
          <h2 style="color: #333; margin-bottom: 20px;">Applicant Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${userName}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${userEmail}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${userPhone || 'Not provided'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">This application was submitted through Hireloop Job Portal</p>
        </div>
      </div>
    `;

    // Send email to admin/HR
    await sendEmail({
      to: process.env.ADMIN_EMAIL ,
      subject: emailSubject,
      html: emailBody
    });

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error in job application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};