import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import Webinar from '../models/webinarModel.js';
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

export const shareWebinar = async (req, res) => {
  try {
    const { webinarId, platform } = req.body;
    const userId = req.user?.id;

    const webinar = await Webinar.findOne({ 
      $or: [{ _id: webinarId }, { webinarId: webinarId }] 
    });

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    // Update share count and tracking
    webinar.shareCount += 1;
    if (userId) {
      webinar.sharedBy.push({ userId, platform });
    }
    await webinar.save();

    res.json({ 
      message: 'Webinar shared successfully',
      shareCount: webinar.shareCount,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/webinars/${webinar.webinarId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWebinarByShareId = async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const webinar = await Webinar.findOne({ webinarId: shareId });
    
    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    res.json({ success: true, webinar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};