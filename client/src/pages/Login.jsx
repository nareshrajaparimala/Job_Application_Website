import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  // State for form fields and UI control
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
        role
      });

      // alert(response.data.message);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Login successful:', response.data.user);
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else {
          window.location.href = '/dashboard/user';
        }
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Click outside modal to go back
  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      window.history.back();
    }
  };

  return (
    <div className="login-page" onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>

          {/* Left section image */}
          <div className="sector1">
            <div className="sector1-job-img" />
          </div>

          {/* Right section - login form */}
          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img" />
              <h3 id="logo-text">MytechZ</h3>
            </div>

            <form className="sector2-job-text" onSubmit={handleSubmit}>
              <h1 id="login-text">Log in</h1>

              {/* Role selection */}
              <div className="role-selection">
                <label className="role-label">Login as:</label>
                <div className="role-options">
                  <label className={`role-option ${role === 'user' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="user"
                      checked={role === 'user'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>User</span>
                  </label>
                  <label className={`role-option ${role === 'admin' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>Admin</span>
                  </label>
                </div>
              </div>

              {/* Email input */}
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

              {/* Password input */}
              <div className={`input-group ${passwordFocused ? 'focused' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => setPasswordFocused(!!e.target.value)}
                />
                <label>Password</label>

                <button
                  type="button"
                  className="eye-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="login-actions">
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              {/* Submit button */}
              <button className="login-btn-s2" type="submit">Log In</button>

              {/* Sign-up option */}
              <div className="signup-text">
                Don’t have an account? <a href="/register">Sign up</a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;