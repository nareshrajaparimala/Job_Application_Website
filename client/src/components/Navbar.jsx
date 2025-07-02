//./components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/admit-card">Admit Card</Link></li>
        <li><Link to="/results">Results</Link></li>
        <li><Link to="/documents">Documents</Link></li>
        <li><Link to="/admissions">Admissions</Link></li>
        <li><Link to="/webinars">Webinars</Link></li>
        <li><Link to="/internships">Internships</Link></li>
        <li><Link to="/mentorship">Mentorship</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;