import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [focused, setFocused] = useState({
    first: false,
    last: false,
    email: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 📥 Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 📤 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formData);
      if (response.data.message === 'registered') {
        window.location.href = '/login';
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  // 🖱️ Click Outside Handler
  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      window.history.back();
    }
  };

  return (
    <div className='login-page' onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>
          <div className="sector1">
            <div className="sector1-job-img"></div>
          </div>

          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img"></div>
              <h3 id="logo-text">MytechZ</h3>
            </div>

            <form className="sector2-job-text register-form" onSubmit={handleSubmit}>
              <h1>Sign up as candidate</h1>

              {/* Name Inputs */}
              <div className="input-row">
                {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([name, label]) => (
                  <div
                    key={name}
                    className={`inputR-group ${focused[name.slice(0, 5)] ? 'focused' : ''}`}
                  >
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      onFocus={() => setFocused(f => ({ ...f, [name.slice(0, 5)]: true }))}
                      onBlur={(e) => setFocused(f => ({ ...f, [name.slice(0, 5)]: !!e.target.value }))}
                    />
                    <label>{label}</label>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className={`inputR-group ${focused.email ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, email: true }))}
                  onBlur={(e) => setFocused(f => ({ ...f, email: !!e.target.value }))}
                />
                <label>Email</label>
              </div>

              {/* ☎️ Phone */}
              <div className={`inputR-group ${focused.phone ? 'focused' : ''}`}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, phone: true }))}
                  onBlur={(e) => setFocused(f => ({ ...f, phone: !!e.target.value }))}
                />
                <label>Phone</label>
              </div>

              {/* ⚧ Gender */}
              <div className="gender-row">
                <label>Gender</label>
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g}>
                    <input type="radio" name="gender" value={g} onChange={handleChange} required={g === 'Male'} /> {g}
                  </label>
                ))}
              </div>

              {/* 🔒 Password */}
              {[['password', 'Password', showPassword, setShowPassword], ['confirmPassword', 'Confirm Password', showConfirm, setShowConfirm]].map(([name, label, show, toggle]) => (
                <div key={name} className={`inputR-group ${focused[name.includes('confirm') ? 'confirm' : 'password'] ? 'focused' : ''}`}>
                  <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    onFocus={() => setFocused(f => ({ ...f, [name.includes('confirm') ? 'confirm' : 'password']: true }))}
                    onBlur={(e) => setFocused(f => ({ ...f, [name.includes('confirm') ? 'confirm' : 'password']: !!e.target.value }))}
                  />
                  <label>{label}</label>
                  <button
                    type="button"
                    className="eyeR-btn"
                    tabIndex={-1}
                    onClick={() => toggle(s => !s)}
                    aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
                  >
                    {show ? "🙈" : "👁️"}
                  </button>
                </div>
              ))}

              {/* Checkboxes */}
              <div className="checkbox-row">
                <label>
                  <input type="checkbox" required /> I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
                </label>
              </div>

              <div className="checkbox-row">
                <label>
                  <input type="checkbox" /> Stay in the loop – Get relevant updates curated just for <em>you!</em>
                </label>
              </div>

              {/* Submit */}
              <button className="loginR-btn" type="submit">Sign Up</button>

              <div className="signup-text">
                Already have an account? <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;