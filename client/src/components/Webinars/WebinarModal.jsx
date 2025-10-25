import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';

function WebinarModal({ webinar, isOpen, onClose }) {
  const [showShareModal, setShowShareModal] = useState(false);
  
  if (!isOpen || !webinar) return null;

  const handleShare = async (platform) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/webinars/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webinarId: webinar.webinarId || webinar._id,
          platform
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (window.showPopup) {
          window.showPopup('Webinar shared successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Error sharing webinar:', error);
    }
  };

  const handleRegister = async () => {
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
        onClose();
      } else {
        alert('Failed to register');
      }
    } catch (error) {
      alert('Error registering for webinar');
    }
  };

  const isUpcoming = new Date(webinar.date) > new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{webinar.title}</h2>
            <p className="speaker-info">by {webinar.speaker} • {webinar.organization}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="webinar-overview">
            <div className="overview-item">
              <i className="ri-calendar-line"></i>
              <div>
                <strong>Date</strong>
                <p>{new Date(webinar.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-time-line"></i>
              <div>
                <strong>Time</strong>
                <p>{webinar.time}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className={webinar.mode === 'Online' ? 'ri-computer-line' : 'ri-map-pin-line'}></i>
              <div>
                <strong>{webinar.mode === 'Online' ? 'Platform' : 'Venue'}</strong>
                <p>{webinar.mode === 'Online' ? webinar.platform : webinar.venue}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-money-rupee-circle-line"></i>
              <div>
                <strong>Price</strong>
                <p className={webinar.price === 'Free' ? 'free-price' : 'paid-price'}>
                  {webinar.price}
                </p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>About This Webinar</h3>
            <p>{webinar.description}</p>
          </div>

          <div className="section">
            <h3>Agenda</h3>
            <ul>
              {webinar.agenda.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Requirements</h3>
            <ul>
              {webinar.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>What You'll Get</h3>
            <ul>
              {webinar.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="share-btn-modal" 
            onClick={() => setShowShareModal(true)}
          >
            <i className="ri-share-line"></i>
            Share
          </button>
          <button 
            className="register-btn-modal" 
            onClick={handleRegister}
            disabled={!isUpcoming}
          >
            <i className="ri-calendar-check-line"></i>
            {isUpcoming ? 'Register for this Webinar' : 'Event has ended'}
          </button>
        </div>
      </div>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${window.location.origin}/webinars/${webinar.webinarId || webinar._id}`}
        title={webinar.title}
        type="Webinar"
        onShare={handleShare}
      />
    </div>
  );
}

export default WebinarModal;