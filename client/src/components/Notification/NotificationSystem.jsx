import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

let notificationId = 0;

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    window.showNotification = (message, type = 'info') => {
      const id = ++notificationId;
      const notification = { id, message, type };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    window.showConfirm = (message, onConfirm, onCancel) => {
      const id = ++notificationId;
      const notification = { 
        id, 
        message, 
        type: 'confirm', 
        onConfirm: () => {
          setNotifications(prev => prev.filter(n => n.id !== id));
          onConfirm && onConfirm();
        },
        onCancel: () => {
          setNotifications(prev => prev.filter(n => n.id !== id));
          onCancel && onCancel();
        }
      };
      
      setNotifications(prev => [...prev, notification]);
    };

    return () => {
      delete window.showNotification;
      delete window.showConfirm;
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'success' && <i className="ri-check-circle-line"></i>}
              {notification.type === 'error' && <i className="ri-error-warning-line"></i>}
              {notification.type === 'info' && <i className="ri-information-line"></i>}
              {notification.type === 'confirm' && <i className="ri-question-line"></i>}
            </div>
            <div className="notification-message">{notification.message}</div>
            {notification.type === 'confirm' ? (
              <div className="notification-actions">
                <button onClick={notification.onConfirm} className="confirm-btn">Yes</button>
                <button onClick={notification.onCancel} className="cancel-btn">No</button>
              </div>
            ) : (
              <button onClick={() => removeNotification(notification.id)} className="close-btn">
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;