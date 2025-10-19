import nodemailer from 'nodemailer';

// Create transporter with fallback options for deployment
export const createEmailTransporter = () => {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
  };

  const transporter = nodemailer.createTransporter(config);

  // Test connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email service error:', error.message);
      console.log('📧 EMAIL_USER exists:', !!process.env.EMAIL_USER);
      console.log('🔑 EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    } else {
      console.log('✅ Email service ready');
    }
  });

  return transporter;
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: `"MytechZ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for MytechZ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">MytechZ - OTP Verification</h2>
          <p>Your OTP for verification is:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 2rem; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ OTP email failed:', error.message);
    throw new Error('Failed to send OTP email');
  }
};