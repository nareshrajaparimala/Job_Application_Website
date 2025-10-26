import FacilityRequest from '../models/facilityRequestModel.js';
import User from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';

export const submitFacilityRequest = async (req, res) => {
  try {
    const { name, phone, email, eventName, message, serviceType, serviceId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const facilityRequest = new FacilityRequest({
      userId,
      name,
      phone,
      email,
      eventName,
      message,
      serviceType,
      serviceId
    });

    await facilityRequest.save();

    // Send email to admin
    const emailSubject = `🏢 New Facility Management Request - ${serviceType}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏢 Facility Management Request</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">MytechZ Facility Services</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">📋 Service Request Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Service Type:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${serviceType}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Event/Project Name:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${eventName}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Request Date:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Request ID:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${facilityRequest._id}</td>
            </tr>
          </table>
          
          <h2 style="color: #333; margin-bottom: 20px;">👤 Client Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${phone}</td>
            </tr>
          </table>
          
          ${message ? `
          <h2 style="color: #333; margin-bottom: 20px;">💬 Additional Message</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #666; line-height: 1.6;">${message}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">📧 This request was submitted through MytechZ Facility Management Portal</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Please review and update the request status in the admin dashboard</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@mytechz.in',
        subject: emailSubject,
        html: emailBody
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ 
      message: 'Facility request submitted successfully',
      requestId: facilityRequest._id
    });
  } catch (error) {
    console.error('Error submitting facility request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserFacilityRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const requests = await FacilityRequest.find({ userId })
      .sort({ requestDate: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllFacilityRequests = async (req, res) => {
  try {
    const requests = await FacilityRequest.find()
      .populate('userId', 'firstName lastName email')
      .sort({ requestDate: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateFacilityRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body;

    const request = await FacilityRequest.findByIdAndUpdate(
      requestId,
      { 
        status, 
        adminNotes,
        responseDate: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ 
      message: 'Request status updated successfully',
      request 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};