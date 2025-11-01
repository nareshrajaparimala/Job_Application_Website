import express from 'express';
import { sendEmail } from '../utils/emailService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import GovExamApplication from '../models/govExamApplicationModel.js';
import GovExam from '../models/govExamModel.js';

const router = express.Router();

// Get user's government exam applications
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await GovExamApplication.find({ userId: req.user.id })
      .sort({ appliedAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Get all applications (admin only)
router.get('/all-applications', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const applications = await GovExamApplication.find({})
      .populate('userId', 'firstName lastName email')
      .sort({ appliedAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Update application status (admin only)
router.put('/update-status/:id', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { status, notes } = req.body;
    const application = await GovExamApplication.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: new Date() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Help to apply for government exam
router.post('/help-apply', authenticateToken, async (req, res) => {
  try {
    const { examDetails, userDetails } = req.body;
    
    // Get user from database to ensure we have complete details
    const User = (await import('../models/userModel.js')).default;
    const dbUser = await User.findById(req.user.id);
    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if user has already applied for this exam
    const existingApplication = await GovExamApplication.findOne({
      userId: req.user.id,
      examId: examDetails.id
    });
    
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this exam'
      });
    }
    
    // Use database user details with fallback to request data
    const finalUserDetails = {
      name: userDetails.name || `${dbUser.firstName} ${dbUser.lastName}`,
      email: userDetails.email || dbUser.email,
      phone: userDetails.phone || dbUser.phone || 'Not provided',
      id: req.user.id
    };
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Government Exam Help Request</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">New Help Request</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">User Details:</h3>
            <p><strong>Name:</strong> ${finalUserDetails.name}</p>
            <p><strong>Email:</strong> ${finalUserDetails.email}</p>
            <p><strong>Phone:</strong> ${finalUserDetails.phone}</p>
            <p><strong>User ID:</strong> ${finalUserDetails.id}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Exam Details:</h3>
            <p><strong>Post Name:</strong> ${examDetails.postName}</p>
            <p><strong>Application Start:</strong> ${new Date(examDetails.startDate).toLocaleDateString()}</p>
            <p><strong>Application End:</strong> ${new Date(examDetails.endDate).toLocaleDateString()}</p>
            <p><strong>Exam Date:</strong> ${examDetails.examDate}</p>
            <p><strong>Application Fee:</strong> ${examDetails.applicationFee}</p>
            <p><strong>Age Limit:</strong> ${examDetails.ageLimit}</p>
            <p><strong>Total Posts:</strong> ${examDetails.totalPosts}</p>
            <p><strong>Official Link:</strong> <a href="${examDetails.applyLink}" target="_blank">${examDetails.applyLink}</a></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #856404;">
              <strong>Action Required:</strong> Please contact the user to provide application assistance.
            </p>
          </div>
          
          <p style="margin-top: 20px; color: #666;">
            Request submitted on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    // Save application to database
    const application = new GovExamApplication({
      userId: req.user.id,
      examId: examDetails.id,
      examName: examDetails.postName,
      userDetails: {
        name: finalUserDetails.name,
        email: finalUserDetails.email,
        phone: finalUserDetails.phone
      },
      examDetails: {
        postName: examDetails.postName,
        startDate: examDetails.startDate,
        endDate: examDetails.endDate,
        examDate: examDetails.examDate,
        applicationFee: examDetails.applicationFee,
        ageLimit: examDetails.ageLimit,
        totalPosts: examDetails.totalPosts,
        applyLink: examDetails.applyLink
      }
    });

    await application.save();

    // Send email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@mytechz.in',
      `Government Exam Help Request - ${examDetails.postName}`,
      emailContent
    );

    res.status(200).json({ 
      success: true, 
      message: 'Help request sent successfully',
      applicationId: application._id
    });

  } catch (error) {
    console.error('Help request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send help request' 
    });
  }
});

// Add new government exam (admin only)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const examData = req.body;
    const newExam = new GovExam({
      ...examData,
      id: Date.now(), // Generate unique ID
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newExam.save();
    
    res.status(201).json({
      success: true,
      message: 'Government exam added successfully',
      exam: newExam
    });
  } catch (error) {
    console.error('Add exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add government exam'
    });
  }
});

// Get all government exams
router.get('/all', async (req, res) => {
  try {
    const exams = await GovExam.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch exams' });
  }
});

// Get single government exam by ID
router.get('/detail/:id', async (req, res) => {
  try {
    const exam = await GovExam.findOne({ id: req.params.id, isActive: true });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.status(200).json({ success: true, exam });
  } catch (error) {
    console.error('Get exam detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch exam details' });
  }
});

// Delete government exam (admin only)
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const examId = req.params.id;
    const deletedExam = await GovExam.findOneAndDelete({ id: examId });
    
    if (!deletedExam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Government exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete government exam'
    });
  }
});

export default router;