import nodemailer from 'nodemailer';

// Alternative email service for cloud deployment
export const sendOTPEmailAlternative = async (email, otp, firstName) => {
  console.log('🔄 Trying alternative email service...');
  
  // Try multiple SMTP configurations
  const configs = [
    // Gmail with explicit settings
    {
      name: 'Gmail Primary',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    },
    // Gmail with port 465
    {
      name: 'Gmail SSL',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    },
    // Outlook as fallback
    {
      name: 'Outlook',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER || process.env.EMAIL_USER,
        pass: process.env.OUTLOOK_PASS || process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    }
  ];

  for (const config of configs) {
    try {
      console.log(`📧 Trying ${config.name}...`);
      
      const transporter = nodemailer.createTransporter({
        ...config,
        connectionTimeout: 30000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      });

      // Test connection
      await transporter.verify();
      console.log(`✅ ${config.name} connection verified`);

      const mailOptions = {
        from: `"MytechZ" <${config.auth.user}>`,
        to: email,
        subject: 'Your OTP - MytechZ',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #667eea;">Hello ${firstName}!</h2>
            <p>Your OTP for password reset is:</p>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 2rem; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP expires in 5 minutes.</p>
            <p>Best regards,<br>MytechZ Team</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent via ${config.name}:`, result.messageId);
      return result;

    } catch (error) {
      console.error(`❌ ${config.name} failed:`, error.message);
      continue;
    }
  }

  throw new Error('All email services failed');
};

// Simplified OTP email for testing
export const sendSimpleOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP - MytechZ',
      text: `Your OTP is: ${otp}. Valid for 5 minutes.`,
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes.</p>`
    });

    console.log('✅ Simple OTP sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Simple OTP failed:', error.message);
    throw error;
  }
};