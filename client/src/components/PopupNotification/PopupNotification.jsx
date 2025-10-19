import React, { useState, useEffect } from 'react';
import './PopupNotification.css';

function PopupNotification({ message, type = 'success', isVisible, onClose, autoClose = true }) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return 'ri-check-circle-line';
      case 'error': return 'ri-error-warning-line';
      case 'info': return 'ri-information-line';
      case 'warning': return 'ri-alert-line';
      default: return 'ri-check-circle-line';
    }
  };

  return (
    <div className={`popup-notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="popup-content">
        <div className="popup-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="popup-message">
          {message}
        </div>
        <button className="popup-close" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>
      </div>
      <div className="popup-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}

export default PopupNotification;