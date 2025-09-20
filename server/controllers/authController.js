import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Register User (example)
// export const registerUser = async (req, res) => {
//   const { email, password } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists) return res.status(400).json({ message: 'User already exists' });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ email, password: hashedPassword });
//   res.status(201).json({ message: 'User registered' });
// };

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      password,
      confirmPassword,
      role
    } = req.body;

    // 1. Validate required fields
    if (!firstName || !lastName || !email || !phone || !gender || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      gender,
      password: hashedPassword,
      role: 'user' // Only allow user registration
    });

    // 6. Respond with success
    res.status(201).json({ message: 'registered', user: { name: user.firstName, email: user.email, role: user.role } });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Login User
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;
    
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
// console.log( email, password);
//   // Create JWT
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//   res.json({ token, user: { id: user._id, email: user.email },message:"Authenticated" });
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });
    
    // Check for default admin login
    if (role === 'admin' && email === 'Naresh@mytechz.in' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(200).json({
        message: 'Authenticated',
        token,
        user: {
          id: 'admin',
          name: 'Admin',
          email: 'Naresh@mytechz.in',
          role: 'admin'
        }
      });
    }

    // Only allow user role for regular users
    if (role === 'admin') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 🔑 Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('User authenticated:', user.email);
    console.log('Generated token:', token);
    console.log('User role:', user.role);
    // ✅ Send response with combined name and role
    res.status(200).json({
      message: 'Authenticated',
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,  // 🔗 Combined name
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot Password - Generate OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });
    
    // Send OTP via email
    await sendOTPEmail(email, otp, user.firstName);
    
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }
    
    if (storedOTP.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );
    
    // Remove OTP from store
    otpStore.delete(email);
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Email service function
const sendOTPEmail = async (email, otp, firstName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: `"MytechZ.in" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Password Reset OTP - MytechZ.in',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚀 MytechZ.in</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Tech Career Portal</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}! 👋</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. Use the OTP below to proceed:
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0;">
            <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">This OTP expires in 5 minutes</p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⚠️ <strong>Security Note:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>The MytechZ Team</strong> 💼
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2024 MytechZ.in - Premier Technology Solutions & Job Portal</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.role;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // In a real application, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll simulate with a placeholder URL
    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password');
    
    res.status(200).json({ photoUrl, user });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
