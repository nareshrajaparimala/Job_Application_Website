import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import './InternshipListing.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function InternshipCard({ internship, onClick }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const handleApply = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      if (window.showPopup) {
        window.showPopup('Please login to apply', 'warning');
      } else {
        alert('Please login to apply for this internship');
      }
      window.location.href = '/login';
      return;
    }

    // Check if already applied
    const appliedInternships = JSON.parse(localStorage.getItem('appliedInternships') || '[]');
    if (appliedInternships.includes(internship.id || internship._id)) {
      setIsLoading(false);
      if (window.showPopup) {
        window.showPopup('Already applied to this internship', 'info');
      } else {
        alert('You have already applied to this internship');
      }
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/internships/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internship }),
      });

      if (response.ok) {
        // Mark as applied
        const appliedInternships = JSON.parse(localStorage.getItem('appliedInternships') || '[]');
        appliedInternships.push(internship.id || internship._id);
        localStorage.setItem('appliedInternships', JSON.stringify(appliedInternships));
        
        if (window.showPopup) {
          window.showPopup('Applied successfully!', 'success');
        } else {
          alert('Application submitted successfully!');
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (window.showPopup) {
          window.showPopup('Failed to apply', 'error');
        } else {
          alert('Failed to apply');
        }
      }
    } catch (error) {
      setIsLoading(false);
      if (window.showPopup) {
        window.showPopup('Error applying to internship', 'error');
      } else {
        alert('Error applying to internship');
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner message="Submitting application..." />}
      <div className="internship-card" onClick={() => onClick(internship)}>
      <div className="card-header">
        <div className="company-info">
          <h3 className="internship-title">{internship.title}</h3>
          <p className="company-name">{internship.company}</p>
        </div>
        <div className="internship-meta">
          <span className="work-mode">{internship.workMode}</span>
          <span className="internship-type">{internship.type}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="internship-details">
          <div className="detail-item">
            <i className="ri-map-pin-line"></i>
            <span>{internship.location}</span>
          </div>
          <div className="detail-item">
            <i className="ri-time-line"></i>
            <span>{internship.duration}</span>
          </div>
          <div className="detail-item">
            <i className="ri-money-rupee-circle-line"></i>
            <span>{internship.stipend}</span>
          </div>
        </div>

        <p className="internship-description">{internship.shortDescription}</p>

        <div className="skills-tags">
          {internship.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {internship.skills.length > 3 && (
            <span className="skill-tag more">+{internship.skills.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="internship-dates">
          <span className="posted-date">Posted: {new Date(internship.datePosted).toLocaleDateString()}</span>
          <span className="deadline">Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
        </div>
        <div className="action-buttons">
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
            className="get-link-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (internship.applicationLink) {
                window.open(internship.applicationLink, '_blank');
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/internships/${internship._id}`);
                if (window.showPopup) {
                  window.showPopup('Link copied!', 'success');
                } else {
                  alert('Internship link copied to clipboard!');
                }
              }
            }}
          >
            <i className="ri-external-link-line"></i>
            Get Link
          </button>
          <button className="apply-btn" onClick={handleApply}>
            <i className="ri-send-plane-line"></i>
            Apply Now
          </button>
        </div>
      </div>
    </div>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${window.location.origin}/internship/${internship.id || internship._id}`}
        title={internship.title}
        type="Internship"
      />
    </>
  );
}

export default InternshipCard;