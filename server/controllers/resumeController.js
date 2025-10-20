import ResumeTemplate from '../models/resumeTemplateModel.js';
import ResumeApplication from '../models/resumeApplicationModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../utils/emailService.js';

// Get all active templates
export const getTemplates = async (req, res) => {
  try {
    const templates = await ResumeTemplate.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit resume application
export const submitResumeApplication = async (req, res) => {
  try {
    const { templateId, userDetails, totalAmount } = req.body;
    const userId = req.user.id;

    if (userId === 'admin') {
      return res.status(403).json({ message: 'Admin cannot submit resume applications' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const template = await ResumeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const application = new ResumeApplication({
      userId,
      templateId,
      userDetails,
      totalAmount
    });

    await application.save();

    // Send detailed email to admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">New Resume Application</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Resume Application Details</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Customer Information:</h3>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || userDetails.phone}</p>
            <p><strong>User ID:</strong> ${user._id}</p>
            <p><strong>Gender:</strong> ${user.gender || 'Not specified'}</p>
            ${user.dateOfBirth ? `<p><strong>Date of Birth:</strong> ${user.dateOfBirth}</p>` : ''}
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Application Details:</h3>
            <p><strong>Template:</strong> ${template.name}</p>
            <p><strong>Template Price:</strong> ₹${template.price}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            <p><strong>Application ID:</strong> ${application._id}</p>
            <p><strong>Applied At:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #f57c00; margin-top: 0;">User Provided Details:</h3>
            <p><strong>Full Name:</strong> ${userDetails.fullName}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Phone:</strong> ${userDetails.phone}</p>
            <p><strong>Address:</strong> ${userDetails.address || 'Not provided'}</p>
            <p><strong>Experience:</strong> ${userDetails.experience}</p>
            <p><strong>Education:</strong> ${userDetails.education}</p>
            <p><strong>Skills:</strong> ${userDetails.skills}</p>
            ${userDetails.customizations ? `<p><strong>Customizations:</strong> ${userDetails.customizations}</p>` : ''}
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #856404;">
              <strong>Action Required:</strong> Please contact the customer to discuss resume requirements and timeline.
            </p>
          </div>
        </div>
      </div>
    `;
    
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@mytechz.in',
        `New Resume Application - ${template.name}`,
        adminEmailContent
      );
      
      // Send confirmation email to user
      const userEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Resume Application Received</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Dear ${userDetails.fullName},</h2>
            <p>Thank you for your resume application! We have received your request and will contact you soon.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">Your Application Summary:</h3>
              <p><strong>Template:</strong> ${template.name}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p><strong>Application ID:</strong> ${application._id}</p>
              <p><strong>Status:</strong> Pending Review</p>
            </div>
            
            <p>Our team will review your requirements and contact you within 24-48 hours to discuss the next steps.</p>
            <p>Best regards,<br>MytechZ Team</p>
          </div>
        </div>
      `;
      
      await sendEmail(
        userDetails.email,
        'Resume Application Confirmation - We\'ll Contact You Soon!',
        userEmailContent
      );
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }

    res.json({ message: 'Resume application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Add/Update template
export const manageTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update existing template
      const template = await ResumeTemplate.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ message: 'Template updated successfully', template });
    } else {
      // Create new template
      const template = new ResumeTemplate(req.body);
      await template.save();
      res.json({ message: 'Template created successfully', template });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Delete template
export const deleteTemplate = async (req, res) => {
  try {
    await ResumeTemplate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all applications
export const getResumeApplications = async (req, res) => {
  try {
    const applications = await ResumeApplication.find()
      .populate('userId', 'firstName lastName email phone')
      .populate('templateId', 'name price')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = { status, notes };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const application = await ResumeApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

