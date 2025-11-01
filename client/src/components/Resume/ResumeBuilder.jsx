import React, { useState } from 'react';
import './ResumeBuilder.css';

function ResumeBuilder({ template, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    education: '',
    skills: '',
    customizations: ''
  });
  const [needCustomization, setNeedCustomization] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return template.price + (needCustomization ? template.customizationPrice : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit resume application');
        return;
      }

      console.log('Submitting resume application:', {
        templateId: template._id,
        userDetails: formData,
        totalAmount: calculateTotal()
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/resume/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: template._id || template.id,
          userDetails: formData,
          totalAmount: calculateTotal()
        }),
      });

      if (response.ok) {
        alert('Resume application submitted successfully! We will contact you soon.');
        onBack();
      } else {
        const error = await response.json();
        console.error('Resume application error:', error);
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="resume-builder-container">
      <div className="builder-header">
        <button className="back-btn" onClick={onBack}>
          <i className="ri-arrow-left-line"></i>
          Back to Templates
        </button>
        <h1>Build Your Resume</h1>
        <div className="selected-template">
          <span>Selected: {template.name}</span>
        </div>
      </div>

      <div className="builder-content">
        <div className="builder-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Professional Details</h2>
            <div className="form-group">
              <label>Work Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your work experience, job titles, companies, and achievements..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="List your educational qualifications, degrees, institutions..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="List your technical and soft skills..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Customization Options</h2>
            <div className="customization-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={needCustomization}
                  onChange={(e) => setNeedCustomization(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                Need Custom Design Changes (+₹{template.customizationPrice})
              </label>
            </div>
            
            {needCustomization && (
              <div className="form-group">
                <label>Customization Requirements</label>
                <textarea
                  name="customizations"
                  value={formData.customizations}
                  onChange={handleInputChange}
                  placeholder="Describe any specific design changes, color preferences, layout modifications..."
                  rows="3"
                />
              </div>
            )}
          </div>
        </div>

        <div className="builder-preview">
          <div className="preview-card">
            <h3>Order Summary</h3>
            <div className="template-preview">
              <img src={template.templateImage} alt={template.name} />
              <div className="template-details">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
            </div>
            
            <div className="pricing-breakdown">
              <div className="price-row">
                <span>Template Price</span>
                <span>₹{template.price}</span>
              </div>
              {needCustomization && (
                <div className="price-row">
                  <span>Customization</span>
                  <span>₹{template.customizationPrice}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <div className="features-list">
              <h4>Included Features:</h4>
              {template.features?.map((feature, index) => (
                <div key={index} className="feature-item">
                  <i className="ri-check-line"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className="submit-application-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="btn-spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <i className="ri-send-plane-line"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;