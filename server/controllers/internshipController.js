import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import { sendApplicationEmail } from '../utils/emailService.js';

export const applyToInternship = async (req, res) => {
  try {
    const { internship } = req.body;
    const userId = req.user.id;

    if (userId === 'admin') {
      return res.status(403).json({ message: 'Admin cannot apply to internships' });
    }

    const existingApplication = await Application.findOne({
      userId,
      collegeName: internship.title,
      'collegeData.company': internship.company
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this internship' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const application = new Application({
      userId,
      collegeName: `${internship.title} - ${internship.company}`,
      collegeData: internship
    });

    await application.save();
    
    try {
      await sendApplicationEmail(user, internship, 'Internship');
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }
    
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};