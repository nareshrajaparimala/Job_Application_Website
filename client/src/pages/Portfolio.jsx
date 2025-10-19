import React, { useState } from 'react';
import './Portfolio.css';

function Portfolio() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    templateType: '',
    theme: '',
    reason: ''
  });

  const handleTemplateSelect = (templateType) => {
    setSelectedTemplate(templateType);
    setFormData({ ...formData, templateType });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/portfolio/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setShowSuccess(true);
        setFormData({ name: '', mobile: '', email: '', templateType: '', theme: '', reason: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting portfolio request:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="portfolio-page">
      {/* Header Section */}
      <div className="portfolio-header">
        <div className="header-content">
          <h1 className="portfolio-title animated-title">
            Build Your Professional Portfolio With Us <i className="ri-rocket-line"></i>
          </h1>
          <p className="portfolio-subtitle">
            Showcase your skills, projects, and achievements with stunning portfolio templates.
          </p>
          <button className="cta-button" onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}>
            Choose Template
          </button>
        </div>
        <div className="header-animation">
          <div className="floating-elements">
            <div className="float-item"><i className="ri-briefcase-line"></i></div>
            <div className="float-item"><i className="ri-palette-line"></i></div>
            <div className="float-item"><i className="ri-computer-line"></i></div>
            <div className="float-item"><i className="ri-rocket-line"></i></div>
          </div>
        </div>
      </div>

      {/* Sample Template Section */}
      <div className="sample-template-section">
        <h2 className="section-title">Sample Portfolio Template</h2>
        <div className="sample-preview">
          <div className="sample-card">
            <div className="sample-header">
              <div className="sample-avatar"></div>
              <div className="sample-info">
                <h3>John Doe</h3>
                <p>Full Stack Developer</p>
              </div>
            </div>
            <div className="sample-nav">
              <span>About</span>
              <span>Skills</span>
              <span>Projects</span>
              <span>Contact</span>
            </div>
            <div className="sample-content">
              <div className="sample-project"></div>
              <div className="sample-project"></div>
              <div className="sample-project"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Options */}
      <div id="templates" className="template-section">
        <h2 className="section-title">Select Your Portfolio Template</h2>
        <div className="template-grid">
          <div className="template-card">
            <div className="template-header">
              <h3>Predefined Template</h3>
              <div className="price">₹500 / year</div>
            </div>
            <ul className="features-list">
              <li>📌 Ready-to-use design</li>
              <li>📌 Quick setup</li>
              <li>📌 Responsive</li>
            </ul>
            <div className="template-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => window.open('https://nareshr-code-portfolio.netlify.app', '_blank')}
              >
                View Sample Template
              </button>
              <button className="btn-primary" onClick={() => handleTemplateSelect('predefined')}>
                Get Started
              </button>
            </div>
          </div>

          <div className="template-card featured">
            <div className="template-header">
              <h3>Customized Template</h3>
              <div className="price">₹1500 / year</div>
            </div>
            <ul className="features-list">
              <li>📌 Unique design</li>
              <li>📌 Personalized branding</li>
              <li>📌 Responsive</li>
            </ul>
            <div className="template-buttons">
              <button className="btn-primary" onClick={() => handleTemplateSelect('customized')}>
                Request Custom Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Highlights */}
      <div className="highlights-section">
        <h2 className="section-title">Why Choose Our Service?</h2>
        <div className="highlights-grid">
          <div className="highlight-item">
            <div className="highlight-icon"><i className="ri-palette-line"></i></div>
            <p>Modern and Responsive Design</p>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><i className="ri-flashlight-line"></i></div>
            <p>Easy to Update and Maintain</p>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><i className="ri-search-line"></i></div>
            <p>SEO Optimized for Better Reach</p>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon"><i className="ri-money-dollar-circle-line"></i></div>
            <p>Affordable Pricing</p>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon">🛠️</div>
            <p>1-Year Validity & Support Included</p>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="pricing-section">
        <h2 className="section-title">Simple Pricing, No Hidden Charges</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Predefined Template</h3>
            <div className="pricing-amount">₹500 / year</div>
          </div>
          <div className="pricing-card">
            <h3>Customized Template</h3>
            <div className="pricing-amount">₹1500 / year</div>
          </div>
        </div>
        <p className="pricing-note">Includes hosting support & updates for 1 year.</p>
      </div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <h2>Start Building Your Portfolio Today!</h2>
        <div className="cta-buttons">
          <button className="btn-outline" onClick={() => handleTemplateSelect('predefined')}>
            Choose Predefined Template
          </button>
          <button className="btn-primary" onClick={() => handleTemplateSelect('customized')}>
            Get Customized Template
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Portfolio Request - {selectedTemplate === 'predefined' ? 'Predefined' : 'Customized'} Template</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Theme/Field *</label>
                <select name="theme" value={formData.theme} onChange={handleInputChange} required>
                  <option value="">Select Theme</option>
                  <option value="developer">Developer/Tech</option>
                  <option value="designer">Designer/Creative</option>
                  <option value="business">Business/Corporate</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="student">Student/Academic</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason for Portfolio *</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Tell us why you need this portfolio..."
                  required
                ></textarea>
              </div>
              <div className="form-buttons">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h2>Congratulations! <i className="ri-trophy-line"></i></h2>
            <p>Your application has been submitted successfully!</p>
            <p>We will contact you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;