import React, { useState, useEffect } from 'react';
import './TemplateEditModal.css';

function TemplateEditModal({ template, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    customizationPrice: '',
    templateImage: '',
    features: '',
    isActive: true
  });

  useEffect(() => {
    if (template && template._id) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        price: template.price || '',
        customizationPrice: template.customizationPrice || '',
        templateImage: template.templateImage || '',
        features: template.features?.join(', ') || '',
        isActive: template.isActive !== undefined ? template.isActive : true
      });
    }
  }, [template]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateData = {
      ...formData,
      price: Number(formData.price),
      customizationPrice: Number(formData.customizationPrice),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };
    onSave(templateData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{template._id ? 'Edit Template' : 'Add New Template'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="template-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Template Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Template Image URL</label>
              <input
                type="url"
                name="templateImage"
                value={formData.templateImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Base Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Customization Price (₹) *</label>
              <input
                type="number"
                name="customizationPrice"
                value={formData.customizationPrice}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group full-width">
              <label>Features (comma separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="ATS Friendly, Clean Layout, Professional Fonts"
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Active Template
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <i className="ri-save-line"></i>
              {template._id ? 'Update Template' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateEditModal;