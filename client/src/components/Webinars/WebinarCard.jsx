import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';

function WebinarCard({ webinar, onClick }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const handleRegister = async (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/webinars/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ webinar }),
      });

      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Failed to register');
      }
    } catch (error) {
      alert('Error registering for webinar');
    }
  };

  return (
    <>
    <div className="webinar-card" onClick={() => onClick(webinar)}>
      <div className="card-header">
        <div className="webinar-info">
          <h3 className="webinar-title">{webinar.title}</h3>
          <p className="speaker-name">by {webinar.speaker}</p>
          <p className="organization">{webinar.organization}</p>
        </div>
        <div className="webinar-meta">
          <span className={`mode-badge ${webinar.mode.toLowerCase()}`}>
            {webinar.mode}
          </span>
          <span className="category-badge">{webinar.category}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="webinar-details">
          <div className="detail-item">
            <i className="ri-calendar-line"></i>
            <span>{new Date(webinar.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <i className="ri-time-line"></i>
            <span>{webinar.time}</span>
          </div>
          <div className="detail-item">
            <i className={webinar.mode === 'Online' ? 'ri-computer-line' : 'ri-map-pin-line'}></i>
            <span>{webinar.mode === 'Online' ? webinar.platform : webinar.venue}</span>
          </div>
          <div className="detail-item">
            <i className="ri-money-rupee-circle-line"></i>
            <span className={webinar.price === 'Free' ? 'free-price' : 'paid-price'}>
              {webinar.price}
            </span>
          </div>
        </div>

        <p className="webinar-description">{webinar.shortDescription}</p>
      </div>

      <div className="card-footer">
        <div className="webinar-status">
          <span className="event-date">
            {new Date(webinar.date) > new Date() ? 'Upcoming Event' : 'Past Event'}
          </span>
        </div>
        <div className="webinar-actions">
          <button 
            className="share-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
          >
            <i className="ri-share-line"></i>
            Share
          </button>
          <button 
            className="register-btn" 
            onClick={handleRegister}
            disabled={new Date(webinar.date) < new Date()}
          >
            <i className="ri-calendar-check-line"></i>
            {new Date(webinar.date) > new Date() ? 'Register Now' : 'Event Ended'}
          </button>
        </div>
      </div>
    </div>
    
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareUrl={`${window.location.origin}/webinar/${webinar.id}`}
      title={webinar.title}
      type="Webinar"
    />
    </>
  );
}

export default WebinarCard;