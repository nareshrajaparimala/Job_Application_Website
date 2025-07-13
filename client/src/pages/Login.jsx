import React,{useState} from 'react'
import './Login.css'

function Login () {
    const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div className='login-page'>
        <div className="back-box">
            {/* inbox */}
            <div className="inbox-div">
                {/* sectors - 1 */}
                <div className="sector1">
                    <div className="sector1-job-img">
                        
                    </div>
                </div>
                {/* sector - 2 */}
                <div className="sector2-login">
                    <div className="sector2-job-img-div">
                        <div className="logo-img"></div>
                        <h3 id="logo-text">Hireloop</h3>
                    </div>
                    <form className="sector2-job-text">
                        <h1 id="login-text">Log in</h1>
                        <div className={`input-group ${emailFocused ? 'focused' : ''}`}>
                            <input
                            type="email"
                            required
                            onFocus={() => setEmailFocused(true)}
                            onBlur={e => setEmailFocused(!!e.target.value)}
                            />
                            <label>Email</label>
                        </div>
                        <div className={`input-group ${passwordFocused ? 'focused' : ''}`}>
                            <input
                            type={showPassword ? "text" : "password"}
                            required
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={e => setPasswordFocused(!!e.target.value)}
                            />
                            <label>Password</label>
                            <button
                            type="button"
                            className="eye-btn"
                            tabIndex={-1}
                            onClick={() => setShowPassword(s => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                            {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <div className="login-actions">
                            <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                        </div>
                        <button className="login-btn-s2" type="submit">Log In</button>
                        <div className="signup-text">
                            Don't have an account? <a href="/register">Sign up</a>
                        </div>
                    </form>





                </div>
            </div>
        </div>
    </div>
  )
}

export default Login