import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceDetail.css';

const serviceData = {
  1: {
    title: 'Infrastructure & Maintenance',
    icon: 'ri-building-line',
    color: '#667eea',
    description: 'Complete building maintenance, electrical systems, plumbing, and equipment management for optimal facility operations.',
    details: {
      meaning: 'This covers the physical structure of the organization — buildings, electrical systems, plumbing, furniture, and equipment.',
      howToStart: [
        'Begin with an inspection of existing facilities',
        'Identify maintenance requirements like repairs, cleaning, or upgrades',
        'Create a maintenance schedule (daily, weekly, monthly)'
      ],
      implementation: [
        'Hire or assign a maintenance team',
        'Keep records of all repairs and maintenance work',
        'Use a Facility Management Software (FMS) to track issues and maintenance history',
        'Conduct regular audits to ensure safety and functionality'
      ]
    },
    features: [
      'Building Structure Maintenance',
      'Electrical System Management',
      'Plumbing & Water Systems',
      'Equipment Maintenance',
      'Safety Inspections',
      'Preventive Maintenance'
    ]
  },
  2: {
    title: 'Housekeeping & Environment',
    icon: 'ri-broom-line',
    color: '#28a745',
    description: 'Professional cleaning services, hygiene maintenance, and environmental management for a healthy workspace.',
    details: {
      meaning: 'This ensures cleanliness, hygiene, and a healthy work environment.',
      howToStart: [
        'Divide the area into zones (office, washroom, cafeteria, etc.)',
        'Prepare a daily cleaning checklist',
        'Purchase cleaning materials and assign housekeeping staff'
      ],
      implementation: [
        'Train housekeeping staff on safety and hygiene standards',
        'Schedule regular inspections',
        'Follow waste management and recycling practices',
        'Maintain indoor air quality (use air purifiers, plants, etc.)'
      ]
    },
    features: [
      'Daily Cleaning Services',
      'Waste Management',
      'Hygiene Maintenance',
      'Air Quality Control',
      'Sanitization Services',
      'Environmental Compliance'
    ]
  },
  3: {
    title: 'Security & Access Control',
    icon: 'ri-shield-check-line',
    color: '#dc3545',
    description: 'Advanced security systems, access control, and safety management solutions for complete protection.',
    details: {
      meaning: 'This sector focuses on protecting people, property, and information.',
      howToStart: [
        'Install CCTV cameras, biometric systems, and visitor logbooks',
        'Hire or outsource trained security personnel'
      ],
      implementation: [
        'Define entry and exit points clearly',
        'Create ID cards or access passes for employees',
        'Use digital access systems to monitor attendance and entry logs',
        'Conduct safety drills and emergency training'
      ]
    },
    features: [
      'CCTV Surveillance',
      'Access Control Systems',
      'Security Personnel',
      'Emergency Response',
      'Visitor Management',
      'Safety Training'
    ]
  },
  4: {
    title: 'Utilities & Energy Management',
    icon: 'ri-flashlight-line',
    color: '#ffc107',
    description: 'Energy-efficient solutions, utility management, and cost optimization for sustainable operations.',
    details: {
      meaning: 'Managing electricity, water, air conditioning, and other utilities efficiently to reduce costs and save energy.',
      howToStart: [
        'List all energy-consuming equipment',
        'Monitor daily usage and identify wastage'
      ],
      implementation: [
        'Switch to energy-efficient appliances (LEDs, sensors)',
        'Implement solar panels or renewable energy if possible',
        'Schedule maintenance of electrical and plumbing systems',
        'Use IoT-based monitoring systems for real-time tracking'
      ]
    },
    features: [
      'Energy Monitoring',
      'Cost Optimization',
      'Renewable Energy Solutions',
      'Utility Management',
      'Smart Systems',
      'Sustainability Programs'
    ]
  },
  5: {
    title: 'Food/Canteen Service',
    icon: 'ri-restaurant-line',
    color: '#fd7e14',
    description: 'Quality food services, canteen management, and nutritious meal planning for employee satisfaction.',
    details: {
      meaning: 'Providing safe, hygienic, and nutritious meals for employees or students.',
      howToStart: [
        'Choose a vendor or hire cooks and helpers',
        'Plan the kitchen setup with safety and hygiene standards'
      ],
      implementation: [
        'Prepare weekly or monthly meal menus',
        'Ensure food safety standards (FSSAI compliance)',
        'Maintain cleanliness in kitchen and dining areas',
        'Collect feedback regularly to improve food quality'
      ]
    },
    features: [
      'Menu Planning',
      'Food Safety Compliance',
      'Kitchen Management',
      'Nutritional Programs',
      'Catering Services',
      'Quality Assurance'
    ]
  }
};

function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = serviceData[serviceId];

  useEffect(() => {
    if (!service) {
      navigate('/facility-management');
    }
  }, [service, navigate]);

  if (!service) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/facility/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          serviceType: service.title,
          serviceId: serviceId
        })
      });

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup('Request submitted successfully!', 'success');
        }
        setShowRequestForm(false);
        setFormData({ name: '', phone: '', email: '', eventName: '', message: '' });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to submit request', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-detail-page">
      <div className="service-hero" style={{ '--service-color': service.color }}>
        <button className="back-btn" onClick={() => navigate('/facility-management')}>
          <i className="ri-arrow-left-line"></i>
          Back to Services
        </button>
        
        <div className="hero-content">
          <div className="hero-icon">
            <i className={service.icon}></i>
          </div>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <button 
            className="request-btn"
            onClick={() => setShowRequestForm(true)}
          >
            <i className="ri-send-plane-line"></i>
            Request Service
          </button>
        </div>
      </div>

      <div className="service-content">
        <div className="content-section">
          <h2><i className="ri-information-line"></i> What it means</h2>
          <p>{service.details.meaning}</p>
        </div>

        <div className="content-section">
          <h2><i className="ri-play-circle-line"></i> How to Start</h2>
          <ul className="step-list">
            {service.details.howToStart.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="content-section">
          <h2><i className="ri-settings-line"></i> Implementation Steps</h2>
          <ol className="implementation-list">
            {service.details.implementation.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="content-section">
          <h2><i className="ri-star-line"></i> Key Features</h2>
          <div className="features-grid">
            {service.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <i className="ri-check-line"></i>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showRequestForm && (
        <div className="modal-overlay" onClick={() => setShowRequestForm(false)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request {service.title}</h3>
              <button onClick={() => setShowRequestForm(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="request-form">
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
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
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
                <label>Event/Project Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your requirements..."
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetail;