import College from '../models/College.js';
import nodemailer from 'nodemailer';

// @desc    Get colleges with filters and pagination
// @route   GET /api/colleges
// @access  Public
export const getColleges = async (req, res) => {
  try {
    const {
      search,
      location,
      rating,
      course,
      type,
      studyMode,
      admissionStatus,
      feeMin,
      feeMax,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (location) {
      query.city = location;
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (course) {
      query.courses = course;
    }

    if (type) {
      query.type = type;
    }

    if (studyMode) {
      query.studyMode = studyMode;
    }

    if (admissionStatus) {
      query.admissionStatus = admissionStatus;
    }

    if (feeMin || feeMax) {
      query.fee = {};
      if (feeMin) query.fee.$gte = Number(feeMin);
      if (feeMax) query.fee.$lte = Number(feeMax);
    }

    let sortOption = {};
    if (sortBy === 'costHighToLow') {
      sortOption.fee = -1;
    } else if (sortBy === 'costLowToHigh') {
      sortOption.fee = 1;
    } else if (sortBy === 'ratingHighToLow') {
      sortOption.rating = -1;
    }

    const skip = (page - 1) * limit;

    const colleges = await College.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await College.countDocuments(query);

    res.json({
      colleges,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Apply to a college and send email
// @route   POST /api/colleges/apply
// @access  Private
export const applyToCollege = async (req, res) => {
  try {
    const user = req.user;
    const { college } = req.body;
    console.log('User:', user);
    if (!college) {
      return res.status(400).json({ message: 'College details are required' });
    }

    // Create transporter for nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Your gmail address
        pass: process.env.EMAIL_PASS , // Your gmail password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'nareshrajaparimala000@gmail.com',
      subject: `New College Application from ${user.name || user.email}`,
      text: `
        User Details:
        Name: ${user.firstName+" "+user.lastName || 'N/A'}
        Email: ${user.email}
        Phone Number: ${user.phone || 'N/A'}

        Applied College Details:
        Name: ${college.name || 'N/A'}
        Rating: ${college.rating || 'N/A'}
        Courses: ${college.courses ? college.courses.join(', ') : 'N/A'}
        Details: ${college.details || 'N/A'}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Application successful, email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send application email' });
  }
};
