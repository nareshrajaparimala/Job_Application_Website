import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  // 🔐 State for form fields and UI control
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // 🔁 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5010/api/auth/login', {
        email,
        password
      });

      // alert(response.data.message);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Login successful:', response.data.user);
        window.location.href = '/';
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ❌ Click outside modal → Go back
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
              <h3 id="logo-text">Hireloop</h3>
            </div>

            <form className="sector2-job-text" onSubmit={handleSubmit}>
              <h1 id="login-text">Log in</h1>

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