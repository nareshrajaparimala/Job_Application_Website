import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
  } else {
    console.log('Email service ready');
  }
});

export const sendApplicationEmail = async (userDetails, applicationData, applicationType) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New ${applicationType} Application - ${applicationData.name || applicationData.title}`,
      html: `
        <h2>New ${applicationType} Application</h2>
        
        <h3>User Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${userDetails.firstName} ${userDetails.lastName}</li>
          <li><strong>Email:</strong> ${userDetails.email}</li>
          <li><strong>Phone:</strong> ${userDetails.phone}</li>
          <li><strong>Gender:</strong> ${userDetails.gender}</li>
        </ul>
        
        <h3>${applicationType} Details:</h3>
        ${applicationType === 'College' ? `
          <ul>
            <li><strong>College:</strong> ${applicationData.name}</li>
            <li><strong>Rating:</strong> ${applicationData.rating}</li>
            <li><strong>Courses:</strong> ${applicationData.courses?.join(', ')}</li>
            <li><strong>Details:</strong> ${applicationData.details}</li>
          </ul>
        ` : applicationType === 'Internship' ? `
          <ul>
            <li><strong>Title:</strong> ${applicationData.title}</li>
            <li><strong>Company:</strong> ${applicationData.company}</li>
            <li><strong>Duration:</strong> ${applicationData.duration}</li>
            <li><strong>Stipend:</strong> ${applicationData.stipend}</li>
            <li><strong>Work Mode:</strong> ${applicationData.workMode}</li>
            <li><strong>Skills:</strong> ${applicationData.skills?.join(', ')}</li>
          </ul>
        ` : applicationType === 'Resume' ? `
          <ul>
            <li><strong>Template:</strong> ${applicationData.name}</li>
            <li><strong>Full Name:</strong> ${applicationData.fullName}</li>
            <li><strong>Email:</strong> ${applicationData.email}</li>
            <li><strong>Phone:</strong> ${applicationData.phone}</li>
            <li><strong>Address:</strong> ${applicationData.address}</li>
            <li><strong>Experience:</strong> ${applicationData.experience}</li>
            <li><strong>Education:</strong> ${applicationData.education}</li>
            <li><strong>Skills:</strong> ${applicationData.skills}</li>
            <li><strong>Total Amount:</strong> ₹${applicationData.totalAmount}</li>
          </ul>
        ` : `
          <ul>
            <li><strong>Title:</strong> ${applicationData.title}</li>
            <li><strong>Speaker:</strong> ${applicationData.speaker}</li>
            <li><strong>Date:</strong> ${applicationData.date}</li>
            <li><strong>Time:</strong> ${applicationData.time}</li>
            <li><strong>Mode:</strong> ${applicationData.mode}</li>
            <li><strong>Price:</strong> ${applicationData.price}</li>
          </ul>
        `}
        
        <p><strong>Applied on:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending application email:', error);
    throw error;
  }
};

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};