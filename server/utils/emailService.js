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
  }
});

console.log('Email config:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***' : 'MISSING'
});

export const sendApplicationEmail = async (userDetails, applicationData, applicationType) => {
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

  await transporter.sendMail(mailOptions);
};