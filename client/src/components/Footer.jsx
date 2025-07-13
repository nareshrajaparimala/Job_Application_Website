//./components/Footer.jsx
import React from 'react';
import './Footer.css'

function Footer() {
  return (
     <footer className="footer">
      <div className="footer-main">
        <div className="footer-col">
          <h3 className="footer-logo">Hire Loop</h3>
          <p className="footer-desc">
            Your one-stop portal for Government & Private Jobs, Admit Cards, Results, Internships, Mentorship, and more.
          </p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/jobs/government">Government Jobs</a></li>
            <li><a href="/jobs/private">Private Jobs</a></li>
            <li><a href="/admit-card">Admit Cards</a></li>
            <li><a href="/results">Results</a></li>
            <li><a href="/internships">Internships</a></li>
            <li><a href="/webinars">Webinars</a></li>
            <li><a href="/mentorship">Mentorship</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>
            <strong>Email:</strong> <a href="mailto:support@hireloop.com">support@hireloop.com</a><br />
            <strong>Phone:</strong> <a href="tel:+911234567890">+91 12345 67890</a><br />
            <strong>Address:</strong><br />
            2nd Floor, Tech Park,<br />
            Bangalore, India
          </p>
           <div className="footer-social">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">🔗</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Hire Loop. All rights reserved.</span>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms" style={{ marginLeft: '15px' }}>Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;