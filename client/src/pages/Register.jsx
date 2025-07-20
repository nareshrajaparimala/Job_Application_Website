import React,{useState} from 'react'
import axios from 'axios';
import './Register.css'


function Register (){
const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState({
    first: false,
    last: false,
    email: false,
    phone: false,
    password: false,
    confirm: false,
  });

 // 🔁 Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  // 🔁 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔁 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5010/api/auth/register', formData);
      alert(response.data.message);

      if (response.data.message === 'registered') {
        window.location.href = '/login';
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  // out click to close the file
  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      // Clicked outside .inbox-div → stay on same page (you can skip this or just avoid redirect)
      window.history.back();

    }
  };

  return (
      <div className='login-page'onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>
          <div className="sector1">
            <div className="sector1-job-img"></div>
          </div>

          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img"></div>
              <h3 id="logo-text">Hireloop</h3>
            </div>

            <form className="sector2-job-text register-form" onSubmit={handleSubmit}>
              <h1>Sign up as candidate</h1>

              <div className="input-row">
                <div className={`inputR-group ${focused.first ? 'focused' : ''}`}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    onFocus={() => setFocused(f => ({ ...f, first: true }))}
                    onBlur={e => setFocused(f => ({ ...f, first: !!e.target.value }))}
                  />
                  <label>First Name</label>
                </div>

                <div className={`inputR-group ${focused.last ? 'focused' : ''}`}>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    onFocus={() => setFocused(f => ({ ...f, last: true }))}
                    onBlur={e => setFocused(f => ({ ...f, last: !!e.target.value }))}
                  />
                  <label>Last Name</label>
                </div>
              </div>

              <div className={`inputR-group ${focused.email ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, email: true }))}
                  onBlur={e => setFocused(f => ({ ...f, email: !!e.target.value }))}
                />
                <label>Email</label>
              </div>

              <div className={`inputR-group ${focused.phone ? 'focused' : ''}`}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, phone: true }))}
                  onBlur={e => setFocused(f => ({ ...f, phone: !!e.target.value }))}
                />
                <label>Phone</label>
              </div>

              <div className="gender-row">
                <label>Gender</label>
                <label><input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male</label>
                <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
                <label><input type="radio" name="gender" value="Other" onChange={handleChange} /> Other</label>
              </div>

              <div className={`inputR-group ${focused.password ? 'focused' : ''}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, password: true }))}
                  onBlur={e => setFocused(f => ({ ...f, password: !!e.target.value }))}
                />
                <label>Password</label>
                <button
                  type="button"
                  className="eyeR-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className={`inputR-group ${focused.confirm ? 'focused' : ''}`}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  onFocus={() => setFocused(f => ({ ...f, confirm: true }))}
                  onBlur={e => setFocused(f => ({ ...f, confirm: !!e.target.value }))}
                />
                <label>Confirm Password</label>
                <button
                  type="button"
                  className="eyeR-btn"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>

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