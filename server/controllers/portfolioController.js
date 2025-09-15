import PortfolioRequest from '../models/portfolioModel.js';
import { sendEmail } from '../utils/emailService.js';

// Submit portfolio request
const submitPortfolioRequest = async (req, res) => {
  try {
    const { name, mobile, email, templateType, theme, reason } = req.body;
    
    // Create new portfolio request
    const portfolioRequest = new PortfolioRequest({
      name,
      mobile,
      email,
      templateType,
      theme,
      reason,
      userId: req.user?.id || null
    });

    await portfolioRequest.save();

    // Send email to admin
    const adminEmailContent = `
      <h2>New Portfolio Request Received</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Request Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Template Type:</strong> ${templateType === 'predefined' ? 'Predefined Template (₹500/year)' : 'Customized Template (₹1500/year)'}</p>
        <p><strong>Theme/Field:</strong> ${theme}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Request ID:</strong> ${portfolioRequest._id}</p>
      </div>
      <p>Please review and contact the customer soon.</p>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Portfolio Request - Action Required',
      adminEmailContent
    );

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Portfolio Request Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your portfolio request! We have received your application and will contact you soon.</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Request Summary:</h3>
        <p><strong>Template Type:</strong> ${templateType === 'predefined' ? 'Predefined Template' : 'Customized Template'}</p>
        <p><strong>Theme:</strong> ${theme}</p>
        <p><strong>Request ID:</strong> ${portfolioRequest._id}</p>
      </div>
      <p>Our team will review your requirements and get back to you within 24-48 hours.</p>
      <p>Best regards,<br>MytechZ Team</p>
    `;

    await sendEmail(
      email,
      'Portfolio Request Received - We\'ll Contact You Soon!',
      userEmailContent
    );

    res.status(201).json({
      success: true,
      message: 'Portfolio request submitted successfully',
      requestId: portfolioRequest._id
    });

  } catch (error) {
    console.error('Error submitting portfolio request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit portfolio request'
    });
  }
};

// Get user's portfolio requests
const getUserPortfolioRequests = async (req, res) => {
  try {
    const requests = await PortfolioRequest.find({ userId: req.user.id })
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching user portfolio requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio requests'
    });
  }
};

// Admin: Get all portfolio requests
const getAllPortfolioRequests = async (req, res) => {
  try {
    const requests = await PortfolioRequest.find()
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching all portfolio requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio requests'
    });
  }
};

// Admin: Update portfolio request status
const updatePortfolioRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await PortfolioRequest.findByIdAndUpdate(
      requestId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio request not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio request status updated',
      request
    });
  } catch (error) {
    console.error('Error updating portfolio request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio request status'
    });
  }
};

export {
  submitPortfolioRequest,
  getUserPortfolioRequests,
  getAllPortfolioRequests,
  updatePortfolioRequestStatus
};