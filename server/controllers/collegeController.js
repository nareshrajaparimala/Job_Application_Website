import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import { sendApplicationEmail } from '../utils/emailService.js';

export const applyToCollege = async (req, res) => {
  try {
    const { college } = req.body;
    const userId = req.user.id;

    // Handle admin user (string ID) vs regular user (ObjectId)
    if (userId === 'admin') {
      return res.status(403).json({ message: 'Admin cannot apply to colleges' });
    }

    const existingApplication = await Application.findOne({
      userId,
      collegeName: college.name
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this college' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const application = new Application({
      userId,
      collegeName: college.name,
      collegeData: college
    });

    await application.save();
    
    try {
      await sendApplicationEmail(user, college, 'College');
      console.log('Application email sent successfully');
    } catch (emailError) {
      console.error('Email failed:', emailError.message);
      // Continue with success response even if email fails
    }
    
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};