import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacilityManagement.css';

const services = [
  {
    id: 1,
    title: 'Infrastructure & Maintenance',
    icon: 'ri-building-line',
    description: 'Complete building maintenance, electrical systems, plumbing, and equipment management',
    color: '#667eea'
  },
  {
    id: 2,
    title: 'Housekeeping & Environment',
    icon: 'ri-home-smile-line',
    description: 'Professional cleaning services, hygiene maintenance, and environmental management',
    color: '#28a745'
  },
  {
    id: 3,
    title: 'Security & Access Control',
    icon: 'ri-shield-check-line',
    description: 'Advanced security systems, access control, and safety management solutions',
    color: '#dc3545'
  },
  {
    id: 4,
    title: 'Utilities & Energy Management',
    icon: 'ri-flashlight-line',
    description: 'Energy-efficient solutions, utility management, and cost optimization',
    color: '#ffc107'
  },
  {
    id: 5,
    title: 'Food/Canteen Service',
    icon: 'ri-restaurant-line',
    description: 'Quality food services, canteen management, and nutritious meal planning',
    color: '#fd7e14'
  }
];

function FacilityManagement() {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState(null);

  const handleServiceClick = (serviceId) => {
    navigate(`/facility-management/${serviceId}`);
  };

  return (
    <div className="facility-management-page">
      <div className="facility-header">
        <div className="header-content">
          <h1>Tech-Driven Facility Management Services</h1>
          <p>Comprehensive solutions for all your facility management needs</p>
        </div>
        <div className="header-animation">
          <i className="ri-building-4-line"></i>
        </div>
      </div>

      <div className="services-container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card ${hoveredService === service.id ? 'hovered' : ''}`}
              onClick={() => handleServiceClick(service.id)}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--service-color': service.color
              }}
            >
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-arrow">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="facility-features">
        <div className="feature-item">
          <i className="ri-24-hours-line"></i>
          <h4>24/7 Support</h4>
          <p>Round-the-clock assistance</p>
        </div>
        <div className="feature-item">
          <i className="ri-team-line"></i>
          <h4>Expert Team</h4>
          <p>Qualified professionals</p>
        </div>
        <div className="feature-item">
          <i className="ri-shield-check-line"></i>
          <h4>Quality Assured</h4>
          <p>Certified service standards</p>
        </div>
      </div>
    </div>
  );
}

export default FacilityManagement;