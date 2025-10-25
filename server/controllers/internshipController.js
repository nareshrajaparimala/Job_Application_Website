import Application from '../models/applicationModel.js';
import User from '../models/userModel.js';
import Internship from '../models/internshipModel.js';
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

export const shareInternship = async (req, res) => {
  try {
    const { internshipId, platform } = req.body;
    const userId = req.user?.id;

    const internship = await Internship.findOne({ 
      $or: [{ _id: internshipId }, { internshipId: internshipId }] 
    });

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Update share count and tracking
    internship.shareCount += 1;
    if (userId) {
      internship.sharedBy.push({ userId, platform });
    }
    await internship.save();

    res.json({ 
      message: 'Internship shared successfully',
      shareCount: internship.shareCount,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/internships/${internship.internshipId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getInternshipByShareId = async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const internship = await Internship.findOne({ internshipId: shareId });
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};