import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import { sendApplicationEmail } from '../utils/emailService.js';

export const applyToCollege = async (req, res) => {
  try {
    const { college } = req.body;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({
      userId,
      collegeName: college.name
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this college' });
    }

    const user = await User.findById(userId);
    const application = new Application({
      userId,
      collegeName: college.name,
      collegeData: college
    });

    await application.save();
    
    try {
      await sendApplicationEmail(user, college, 'College');
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }
    
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};