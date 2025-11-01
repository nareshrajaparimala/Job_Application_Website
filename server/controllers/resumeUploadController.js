import User from '../models/userModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/resumes/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload resume
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old resume file if exists
    if (user.resumeFile && fs.existsSync(user.resumeFile)) {
      fs.unlinkSync(user.resumeFile);
    }

    // Update user with new resume info
    user.resumeFile = req.file.path;
    user.resumeFileName = req.file.originalname;
    user.resumeUploadedAt = new Date();
    user.updatedAt = new Date();

    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeInfo: {
        fileName: user.resumeFileName,
        uploadedAt: user.resumeUploadedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user resume info
export const getResumeInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('resumeFile resumeFileName resumeUploadedAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      hasResume: !!user.resumeFile,
      fileName: user.resumeFileName,
      uploadedAt: user.resumeUploadedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download resume
export const downloadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user || !user.resumeFile) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!fs.existsSync(user.resumeFile)) {
      return res.status(404).json({ message: 'Resume file not found on server' });
    }

    res.download(user.resumeFile, user.resumeFileName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resumeFile && fs.existsSync(user.resumeFile)) {
      fs.unlinkSync(user.resumeFile);
    }

    user.resumeFile = '';
    user.resumeFileName = '';
    user.resumeUploadedAt = null;
    user.updatedAt = new Date();

    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Get all users with resumes
export const getAllUsersWithResumes = async (req, res) => {
  try {
    const users = await User.find({ resumeFile: { $ne: '' } })
      .select('firstName lastName email phone gender resumeFileName resumeUploadedAt createdAt profilePhoto address city state skills experience education')
      .sort({ resumeUploadedAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: Download user resume
export const adminDownloadResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user || !user.resumeFile) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!fs.existsSync(user.resumeFile)) {
      return res.status(404).json({ message: 'Resume file not found on server' });
    }

    res.download(user.resumeFile, `${user.firstName}_${user.lastName}_Resume${path.extname(user.resumeFileName)}`);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};