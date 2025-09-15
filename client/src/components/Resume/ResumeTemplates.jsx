import React, { useState } from 'react';
import './ResumeTemplates.css';

function ResumeTemplates({ onTemplateSelect }) {
  const [templates] = useState([
    {
      _id: '1',
      name: 'Professional Classic',
      description: 'Clean and professional design perfect for corporate roles',
      price: 299,
      customizationPrice: 99,
      templateImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTBlMGUwIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSIzMCIgeT0iNDUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiPkpvaG4gRG9lPC90ZXh0Pgo8dGV4dCB4PSIzMCIgeT0iNjUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPkZ1bGwgU3RhY2sgRGV2ZWxvcGVyPC90ZXh0Pgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjIiIGZpbGw9IiMzMzczZGMiLz4KPHRleHQgeD0iMzAiIHk9IjEzMCIgZmlsbD0iIzMzMzMzMyIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+RXhwZXJpZW5jZTwvdGV4dD4KPHRleHQgeD0iMzAiIHk9IjE1MCIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5Tb2Z0d2FyZSBFbmdpbmVlciAtIFRlY2ggQ29ycDwvdGV4dD4KPHRleHQgeD0iMzAiIHk9IjE3MCIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMCIgZm9udC1mYW1pbHk9IkFyaWFsIj4yMDIwIC0gUHJlc2VudDwvdGV4dD4KPHRleHQgeD0iMzAiIHk9IjIxMCIgZmlsbD0iIzMzMzMzMyIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+U2tpbGxzPC90ZXh0Pgo8cmVjdCB4PSIzMCIgeT0iMjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIGZpbGw9IiNlMGU3ZmYiIHJ4PSIxMCIvPgo8dGV4dCB4PSI0NSIgeT0iMjQ1IiBmaWxsPSIjMzM3M2RjIiBmb250LXNpemU9IjEwIiBmb250LWZhbWlseT0iQXJpYWwiPlJlYWN0PC90ZXh0Pgo8cmVjdCB4PSIxMDAiIHk9IjIzMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZTBlN2ZmIiByeD0iMTAiLz4KPHRleHQgeD0iMTE1IiB5PSIyNDUiIGZpbGw9IiMzMzczZGMiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+Tm9kZTwvdGV4dD4KPC9zdmc+',
      features: ['ATS Friendly', 'Clean Layout', 'Professional Fonts', 'Contact Section']
    },
    {
      _id: '2',
      name: 'Creative Modern',
      description: 'Modern design with creative elements for design roles',
      price: 399,
      customizationPrice: 149,
      templateImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZTBlMGUwIi8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmY2OWI0Ii8+Cjx0ZXh0IHg9IjEwIiB5PSIzMCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPkphbmUgU21pdGg8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+VUkvVVggRGVzaWduZXI8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSI4MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEwIiB5PSIxMTAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5Db250YWN0PC90ZXh0Pgo8dGV4dCB4PSIxMjAiIHk9IjQwIiBmaWxsPSIjMzMzMzMzIiBmb250LXNpemU9IjE4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5BYm91dCBNZTwvdGV4dD4KPHRleHQgeD0iMTIwIiB5PSI2MCIgZmlsbD0iIzY2NjY2NiIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5DcmVhdGl2ZSBkZXNpZ25lciB3aXRoIDUreWVhcnM8L3RleHQ+Cjx0ZXh0IHg9IjEyMCIgeT0iNzUiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCI+b2YgZXhwZXJpZW5jZSBpbiBVSS9VWDwvdGV4dD4KPHRleHQgeD0iMTIwIiB5PSIxMjAiIGZpbGw9IiMzMzMzMzMiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC13ZWlnaHQ9ImJvbGQiPlBvcnRmb2xpbzwvdGV4dD4KPHJlY3QgeD0iMTIwIiB5PSIxNDAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI1MCIgZmlsbD0iI2YwZjBmMCIgcng9IjUiLz4KPHJlY3QgeD0iMjAwIiB5PSIxNDAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI1MCIgZmlsbD0iI2YwZjBmMCIgcng9IjUiLz4KPC9zdmc+',
      features: ['Creative Design', 'Color Accents', 'Modern Typography', 'Portfolio Section']
    },
    {
      _id: '3',
      name: 'Executive Premium',
      description: 'Premium template for senior executive positions',
      price: 599,
      customizationPrice: 199,
      templateImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNlMGUwZTAiLz4KPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMmQzNzQ4Ii8+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+Um9iZXJ0IEpvaG5zb248L3RleHQ+Cjx0ZXh0IHg9IjMwIiB5PSI3MCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5DaGllZiBFeGVjdXRpdmUgT2ZmaWNlcjwvdGV4dD4KPHRleHQgeD0iMzAiIHk9Ijg1IiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPnJvYmVydC5qb2huc29uQGVtYWlsLmNvbTwvdGV4dD4KPHJlY3QgeD0iMjAiIHk9IjEyMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIyNjAiIGZpbGw9IiNmOGY5ZmEiLz4KPHRleHQgeD0iMzAiIHk9IjE0NSIgZmlsbD0iIzJkMzc0OCIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCI+RXhlY3V0aXZlIFN1bW1hcnk8L3RleHQ+Cjx0ZXh0IHg9IjE2MCIgeT0iMTQ1IiBmaWxsPSIjMmQzNzQ4IiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5Qcm9mZXNzaW9uYWwgRXhwZXJpZW5jZTwvdGV4dD4KPHRleHQgeD0iMTYwIiB5PSIxNzAiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCI+Q0VPIC0gVGVjaCBJbm5vdmF0aW9uczwvdGV4dD4KPHRleHQgeD0iMTYwIiB5PSIxODUiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCI+MjAxNSAtIFByZXNlbnQ8L3RleHQ+CjxyZWN0IHg9IjMwIiB5PSIyMDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMiIgZmlsbD0iIzJkMzc0OCIvPgo8dGV4dCB4PSIzMCIgeT0iMjI1IiBmaWxsPSIjMmQzNzQ4IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5LZXkgQWNoaWV2ZW1lbnRzPC90ZXh0Pgo8L3N2Zz4=',
      features: ['Executive Style', 'Premium Layout', 'Achievement Focus', 'Leadership Section']
    }
  ]);

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
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="templates-info">
        <div className="info-card">
          <h3>ATS Optimized</h3>
          <p>All templates are designed to pass Applicant Tracking Systems</p>
        </div>
        <div className="info-card">
          <h3>Fully Customizable</h3>
          <p>Customize colors, fonts, and layout to match your style</p>
        </div>
        <div className="info-card">
          <h3>Multiple Formats</h3>
          <p>Download in PDF, Word, and other popular formats</p>
        </div>
        <div className="info-card">
          <h3>Industry Specific</h3>
          <p>Templates designed for different industries and career levels</p>
        </div>
      </div>
    </div>
  );
}

export default ResumeTemplates;