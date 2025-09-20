import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Focus states
  const [emailFocused, setEmailFocused] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp || !newPassword || !confirmPassword) {
      setMessage('Please fill all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      setMessage(response.data.message);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      window.history.back();
    }
  };

  return (
    <div className="login-page" onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>
          
          <div className="sector1">
            <div className="sector1-job-img" />
          </div>

          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img" />
              <h3 id="logo-text">MytechZ</h3>
            </div>

            {step === 1 ? (
              <form className="sector2-job-text" onSubmit={handleGenerateOTP}>
                <h1 id="login-text "style={{padding:"0px 0px 10px 0px"}}>Forgot Password</h1>
                
                {message && (
                  <div className={`message ${message.includes('sent') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className={`input-group ${emailFocused ? 'focused' : ''}`}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={(e) => setEmailFocused(!!e.target.value)}
                  />
                  <label>Email</label>
                </div>

                <button className="login-btn-s2" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>

                <div className="signup-text">
                  Remember your password? <a href="/login">Login</a>
                </div>
              </form>
            ) : (
              <form className="sector2-job-text" onSubmit={handleResetPassword}>
                <h1 id="login-text">Reset Password</h1>
                
                {message && (
                  <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className={`input-group ${otpFocused ? 'focused' : ''}`}>
                  <input
                    type="text"
                    required
                    maxLength="4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setOtpFocused(true)}
                    onBlur={(e) => setOtpFocused(!!e.target.value)}
                  />
                  <label>Enter 4-digit OTP</label>
                </div>

                <div className={`input-group ${passwordFocused ? 'focused' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={(e) => setPasswordFocused(!!e.target.value)}
                  />
                  <label>New Password</label>
                  <button
                    type="button"
                    className="eye-btn"
                    tabIndex={-1}
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <div className={`input-group ${confirmPasswordFocused ? 'focused' : ''}`}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={(e) => setConfirmPasswordFocused(!!e.target.value)}
                  />
                  <label>Confirm Password</label>
                  <button
                    type="button"
                    className="eye-btn"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <button className="login-btn-s2" type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="signup-text">
                  <a href="#" onClick={() => setStep(1)}>← Back to email</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;