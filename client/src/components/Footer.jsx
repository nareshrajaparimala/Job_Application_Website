//./components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', background: '#f2f2f2', marginTop: '2rem' }}>
      <p>&copy; {new Date().getFullYear()} Job Web Project. All rights reserved.</p>
      <p>
        Your one-stop portal for Government & Private Jobs, Admit Cards, Results, Key Answers, Documents, Admissions, Webinars, Internships, Mentorship, and more.
      </p>
      <p>
        Contact us: <a href="mailto:support@jobwebproject.com">support@jobwebproject.com</a> | 
        <a href="/privacy-policy" style={{ marginLeft: '10px' }}>Privacy Policy</a>
      </p>
    </footer>
  );
}

export default Footer;