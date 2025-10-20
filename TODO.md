# TODO: Fix Forgot Password OTP Email Issue

## Problem
- Gmail SMTP connections timeout when deployed on Render/Netlify due to cloud platform restrictions and Gmail security policies
- Error: ETIMEDOUT on SMTP connection
- OTP emails not being sent successfully

## Solution
Implement fallback email system that tries multiple providers

## Tasks
- [x] Modify sendOTPEmail function in authController.js to use fallback system
- [x] Import alternative email functions from alternativeEmail.js
- [x] Update forgotPassword function to handle fallback gracefully
- [ ] Test email functionality after deployment
- [ ] Consider using dedicated email services (SendGrid, Mailgun) for production

## Files to Edit
- Job_Application_Website/server/controllers/authController.js
