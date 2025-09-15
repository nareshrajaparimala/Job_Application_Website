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

    // Send email notification
    try {
      await sendApplicationEmail(user, { name: template.name, ...userDetails, totalAmount }, 'Resume');
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

