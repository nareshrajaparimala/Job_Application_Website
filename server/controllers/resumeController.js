import ResumeTemplate from '../models/resumeTemplateModel.js';
import ResumeApplication from '../models/resumeApplicationModel.js';
import User from '../models/userModel.js';
import { sendApplicationEmail } from '../utils/emailService.js';

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

    const user = await User.findById(userId);
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

    // Send email notification
    try {
      await sendResumeApplicationEmail(user, template, userDetails, totalAmount);
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

// Send resume application email
const sendResumeApplicationEmail = async (user, template, userDetails, totalAmount) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Resume Application - ${template.name}`,
    html: `
      <h2>New Resume Building Request</h2>
      
      <h3>User Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Phone:</strong> ${user.phone}</li>
      </ul>
      
      <h3>Resume Details:</h3>
      <ul>
        <li><strong>Template:</strong> ${template.name}</li>
        <li><strong>Full Name:</strong> ${userDetails.fullName}</li>
        <li><strong>Email:</strong> ${userDetails.email}</li>
        <li><strong>Phone:</strong> ${userDetails.phone}</li>
        <li><strong>Address:</strong> ${userDetails.address}</li>
        <li><strong>Experience:</strong> ${userDetails.experience}</li>
        <li><strong>Education:</strong> ${userDetails.education}</li>
        <li><strong>Skills:</strong> ${userDetails.skills}</li>
        <li><strong>Customizations:</strong> ${userDetails.customizations}</li>
        <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
      </ul>
      
      <p><strong>Applied on:</strong> ${new Date().toLocaleString()}</p>
    `
  };

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail(mailOptions);
};