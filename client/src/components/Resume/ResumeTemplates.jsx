import React, { useState, useEffect } from 'react';
import './ResumeTemplates.css';

function ResumeTemplates({ onTemplateSelect }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        // Fallback sample templates
        setTemplates(sampleTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(sampleTemplates);
    } finally {
      setLoading(false);
    }
  };

  const sampleTemplates = [
    {
      _id: '1',
      name: 'Professional Classic',
      description: 'Clean and professional design perfect for corporate roles',
      price: 299,
      customizationPrice: 99,
      templateImage: '/api/placeholder/300/400',
      features: ['ATS Friendly', 'Clean Layout', 'Professional Fonts', 'Contact Section']
    },
    {
      _id: '2',
      name: 'Creative Modern',
      description: 'Modern design with creative elements for design roles',
      price: 399,
      customizationPrice: 149,
      templateImage: '/api/placeholder/300/400',
      features: ['Creative Design', 'Color Accents', 'Modern Typography', 'Portfolio Section']
    },
    {
      _id: '3',
      name: 'Executive Premium',
      description: 'Premium template for senior executive positions',
      price: 599,
      customizationPrice: 199,
      templateImage: '/api/placeholder/300/400',
      features: ['Executive Style', 'Premium Layout', 'Achievement Focus', 'Leadership Section']
    }
  ];

  if (loading) {
    return (
      <div className="templates-loading">
        <div className="loading-spinner"></div>
        <p>Loading resume templates...</p>
      </div>
    );
  }

  return (
    <div className="resume-templates-container">
      <div className="templates-header">
        <h1>Professional Resume Templates</h1>
        <p>Choose from our collection of professionally designed resume templates</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template._id} className="template-card">
            <div className="template-image">
              <img src={template.templateImage} alt={template.name} />
              <div className="template-overlay">
                <button 
                  className="preview-btn"
                  onClick={() => onTemplateSelect(template)}
                >
                  <i className="ri-eye-line"></i>
                  Preview & Select
                </button>
              </div>
            </div>
            
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              
              <div className="template-features">
                {template.features?.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              
              <div className="template-pricing">
                <div className="price-item">
                  <span className="price-label">Template Price:</span>
                  <span className="price-value">₹{template.price}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Customization:</span>
                  <span className="price-value">₹{template.customizationPrice}</span>
                </div>
              </div>
              
              <button 
                className="select-template-btn"
                onClick={() => onTemplateSelect(template)}
              >
                Select Template
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="templates-info">
        <div className="info-card">
          <i className="ri-shield-check-line"></i>
          <h3>ATS Optimized</h3>
          <p>All templates are designed to pass Applicant Tracking Systems</p>
        </div>
        <div className="info-card">
          <i className="ri-palette-line"></i>
          <h3>Fully Customizable</h3>
          <p>Customize colors, fonts, and layout to match your style</p>
        </div>
        <div className="info-card">
          <i className="ri-download-line"></i>
          <h3>Multiple Formats</h3>
          <p>Download in PDF, Word, and other popular formats</p>
        </div>
      </div>
    </div>
  );
}

export default ResumeTemplates;