//./components/Navbar.jsx
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  // function to open and close the sidebar
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  return (
    <nav >
      <div className="logo">
        {/* menu dev */}
        <div className="menu dropdown">
          <div className="menu-icondiv color-nav-box">
            <i class="ri-menu-2-line"></i>
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
        <div className="login-link">
          <Link to="/login" className="login-btn">Login</Link>
        </div>
       
        
        <div className="log-icon-div">
          <div className="login-img"onClick={handleSidebarToggle}></div>
        </div>

      </div>
    {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-user">User</span>
            <button className="close-btn" onClick={handleSidebarClose}>×</button>
          </div>
          {/* <div className="sidebar-divider"></div> */}
          
          <ul>
            <div className="sidebar-divider"></div>
            <li><Link to="/profile" onClick={handleSidebarClose}>Profile</Link></li>
            <div className="sidebar-divider"></div>
            
            <li><Link to="/register" onClick={handleSidebarClose}>Register</Link></li>
            <div className="sidebar-divider"></div>
            <li><Link to="/settings" onClick={handleSidebarClose}>Settings</Link></li>
            <div className="sidebar-divider"></div>
            <li><button onClick={() => { /* handle logout logic */ handleSidebarClose(); }}>Logout</button></li>
            <div className="sidebar-divider"></div>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;