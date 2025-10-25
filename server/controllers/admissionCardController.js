import AdmissionCard from '../models/admissionCardModel.js';
import User from '../models/userModel.js';

export const createAdmissionCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const cardData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const admissionCard = new AdmissionCard({
      ...cardData,
      createdBy: userId
    });

    await admissionCard.save();

    res.status(201).json({ 
      message: 'Admission card created successfully',
      admissionCard,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admission-cards/${admissionCard.cardId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdmissionCards = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const admissionCards = await AdmissionCard.find({ createdBy: userId })
      .sort({ issuedDate: -1 });

    res.json({ success: true, admissionCards });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdmissionCardByShareId = async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const admissionCard = await AdmissionCard.findOne({ cardId: shareId })
      .populate('createdBy', 'firstName lastName email');
    
    if (!admissionCard) {
      return res.status(404).json({ message: 'Admission card not found' });
    }

    res.json({ success: true, admissionCard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const shareAdmissionCard = async (req, res) => {
  try {
    const { cardId, platform } = req.body;
    const userId = req.user?.id;

    const admissionCard = await AdmissionCard.findOne({ 
      $or: [{ _id: cardId }, { cardId: cardId }] 
    });

    if (!admissionCard) {
      return res.status(404).json({ message: 'Admission card not found' });
    }

    // Update share count and tracking
    admissionCard.shareCount += 1;
    if (userId) {
      admissionCard.sharedBy.push({ userId, platform });
    }
    await admissionCard.save();

    res.json({ 
      message: 'Admission card shared successfully',
      shareCount: admissionCard.shareCount,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admission-cards/${admissionCard.cardId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAdmissionCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const admissionCard = await AdmissionCard.findOne({ 
      $or: [{ _id: cardId }, { cardId: cardId }],
      createdBy: userId 
    });

    if (!admissionCard) {
      return res.status(404).json({ message: 'Admission card not found or unauthorized' });
    }

    Object.assign(admissionCard, updateData);
    await admissionCard.save();

    res.json({ 
      message: 'Admission card updated successfully',
      admissionCard 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAdmissionCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;

    const admissionCard = await AdmissionCard.findOneAndDelete({ 
      $or: [{ _id: cardId }, { cardId: cardId }],
      createdBy: userId 
    });

    if (!admissionCard) {
      return res.status(404).json({ message: 'Admission card not found or unauthorized' });
    }

    res.json({ message: 'Admission card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};