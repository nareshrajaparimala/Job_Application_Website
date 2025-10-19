import React from 'react';
import './LoadingPage.css';

function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <div className="logo-section">
          <div className="logo-animation">
            <div className="logo-circle">
              <i className="ri-briefcase-line"></i>
            </div>
            <div className="pulse-rings">
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
            </div>
          </div>
          <h1 className="brand-name">MytechZ</h1>
          <p className="tagline">Your Gateway to Career Success</p>
        </div>
        
        <div className="loading-animation">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="loading-text">Loading amazing opportunities...</p>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;