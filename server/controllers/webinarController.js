import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import { sendApplicationEmail } from '../utils/emailService.js';

export const registerForWebinar = async (req, res) => {
  try {
    const { webinar } = req.body;
    const userId = req.user.id;

    if (userId === 'admin') {
      return res.status(403).json({ message: 'Admin cannot register for webinars' });
    }

    const existingRegistration = await Application.findOne({
      userId,
      collegeName: `${webinar.title} - ${webinar.speaker}`,
      'collegeData.date': webinar.date
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this webinar' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const registration = new Application({
      userId,
      collegeName: `${webinar.title} - ${webinar.speaker}`,
      collegeData: webinar
    });

    await registration.save();
    
    try {
      await sendApplicationEmail(user, webinar, 'Webinar');
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }
    
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};