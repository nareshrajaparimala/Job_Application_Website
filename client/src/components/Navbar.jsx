//./components/Navbar.jsx
import React,{useRef,useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  const sidebarRef = useRef(null);

  // function to open and close the sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // close the sidebar by hover on body
  useEffect(() => {
  function handleClickOutside(event) {
    if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      handleSidebarClose();
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // login check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // update the user name
  const [userInfo, setUserInfo] = useState(null);  // 🆕 New state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  return (
    <nav >
      <div className="logo">
        {/* menu dev */}
        <div className="menu dropdown">
            <div className="menu-icondiv color-nav-box">
              <i className="ri-menu-2-line"></i>
            </div>
          {/* drop menu  */}
          <ul className="dropdown-content">
            <li className='color-subnav-box home-nav-h'><Link to="/">Home</Link></li>
            <li className="dropdown-hidden color-subnav-box job-nav-h">
              <span className="dropbtn-hidden  ">Jobs</span>
              <ul className="dropdown-content-hidden">
                <li className='color-subnav-box'><Link to="/jobs/private">Private Jobs</Link></li>
                <li className='color-subnav-box'><Link to="/jobs/government">Government Jobs</Link></li>
              </ul>
            </li>
            <li className='color-subnav-box admitcard-nav-h'><Link to="/admit-card">Admit Card</Link></li>
            <li className='color-subnav-box result-nav-h'><Link to="/results">Results</Link></li>
            <li className='color-subnav-box document-nav-h'><Link to="/documents">Documents</Link></li>
            <li className='color-subnav-box admission-nav-h'><Link to="/admissions">Admissions</Link></li>
            <li className='color-subnav-box webinar-nav-h'><Link to="/webinars">Webinars</Link></li>
            <li className='color-subnav-box'><Link to="/internships">Internships</Link></li>
            <li className='color-subnav-box'><Link to="/mentorship">Mentorship</Link></li>
            <li className='color-subnav-box'><Link to="/contact">Contact</Link></li>
          </ul>

        </div>
        {/* img dev logo */}
        <div className="logo-img"></div>
        <h3 id="logo-text">Hireloop</h3>
      </div>

      <ul className="sector2">
       
        <li className="color-nav-box home-nav"><Link to="/">Home</Link></li>
        <li className="dropdown job-nav">
          <span className="dropbtn color-nav-box">Jobs</span>
          <ul className="dropdown-content">
            <li className='color-subnav-box'><Link to="/jobs/private">Private Jobs</Link></li>
            <li className='color-subnav-box'><Link to="/jobs/government">Government Jobs</Link></li>
          </ul>
        </li>
        <li className="color-nav-box admitcard-nav"><Link to="/admit-card">Admit Card</Link></li>
        <li className="color-nav-box result-nav"><Link to="/results">Results</Link></li>
        <li className="color-nav-box document-nav"><Link to="/documents">Documents</Link></li>
        <li className="color-nav-box admission-nav"><Link to="/admissions">Admissions</Link></li>
        <li className="color-nav-box webinar-nav"><Link to="/webinars">Webinars</Link></li>
      </ul>
      <div className="log-div">
        <div className="line"></div>
        {!isLoggedIn && (
        <div className="login-link">
          <Link to="/login" className="login-btn">Login</Link>
        </div>
       )}
        
        <div className="log-icon-div">
          <div className="login-img"onClick={handleSidebarToggle}></div>
        </div>

      </div>
    {/* Sidebar */}
    {sidebarOpen && (
  <div className="sidebar-overlay"> {/* optional: click area to close */}
    <div className="sidebar" ref={sidebarRef}>
      <div className="sidebar-header">
        <span className="sidebar-user">{userInfo?.name || userInfo?.email|| 'User'}</span>
        <button className="close-btn" onClick={handleSidebarClose}>×</button>
      </div>

      <ul>
        <div className="sidebar-divider"></div>
        <li><Link to="/profile" onClick={handleSidebarClose}>Profile</Link></li>
        <div className="sidebar-divider"></div>
        <li><Link to="/register" onClick={handleSidebarClose}>Register</Link></li>
        <div className="sidebar-divider"></div>
        <li><Link to="/settings" onClick={handleSidebarClose}>Settings</Link></li>
        <div className="sidebar-divider"></div>
        <li>
          <button onClick={() => {
             // 🔐 Clear auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // 🔄 Optional: update login state
                setIsLoggedIn(false);
                setUserInfo(null);

                // ❌ Close sidebar
                handleSidebarClose();

                // 🔁 Redirect to login or homepage
            window.location.href = '/login';
          }}>
            Logout
          </button>
        </li>
        <div className="sidebar-divider"></div>
      </ul>
    </div>
  </div>
  )}
    </nav>
  );
}

export default Navbar;