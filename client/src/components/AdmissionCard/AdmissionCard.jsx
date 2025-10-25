import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import './AdmissionCard.css';

function AdmissionCard({ admissionCard, onEdit, onDelete, isOwner = false, onClick }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = async (platform) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: admissionCard.cardId,
          platform
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (window.showPopup) {
          window.showPopup('Admission card shared successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Error sharing admission card:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="admission-card" onClick={() => onClick && onClick(admissionCard)}>
      <div className="admission-card-header">
        <div className="card-id">Card ID: {admissionCard.cardId}</div>
        <div className="card-actions">
          <button 
            className="share-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            title="Share Admission Card"
          >
            <i className="ri-share-line"></i>
          </button>
          {isOwner && (
            <>
              <button 
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(admissionCard);
                }}
                title="Edit Card"
              >
                <i className="ri-edit-line"></i>
              </button>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(admissionCard.cardId);
                }}
                title="Delete Card"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="admission-card-content">
        <div className="exam-info">
          <h3>{admissionCard.examName}</h3>
          <div className="candidate-info">
            <p><strong>Candidate:</strong> {admissionCard.candidateName}</p>
            <p><strong>Roll Number:</strong> {admissionCard.rollNumber}</p>
          </div>
        </div>

        <div className="exam-details">
          <div className="detail-row">
            <div className="detail-item">
              <i className="ri-calendar-line"></i>
              <div>
                <span>Exam Date</span>
                <p>{formatDate(admissionCard.examDate)}</p>
              </div>
            </div>
            <div className="detail-item">
              <i className="ri-time-line"></i>
              <div>
                <span>Exam Time</span>
                <p>{admissionCard.examTime}</p>
              </div>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <i className="ri-map-pin-line"></i>
              <div>
                <span>Exam Center</span>
                <p>{admissionCard.examCenter}</p>
              </div>
            </div>
            <div className="detail-item">
              <i className="ri-time-fill"></i>
              <div>
                <span>Reporting Time</span>
                <p>{admissionCard.reportingTime}</p>
              </div>
            </div>
          </div>

          <div className="center-address">
            <i className="ri-building-line"></i>
            <div>
              <span>Center Address</span>
              <p>{admissionCard.centerAddress}</p>
            </div>
          </div>

          {admissionCard.seatNumber && (
            <div className="seat-info">
              <i className="ri-reserved-line"></i>
              <div>
                <span>Seat Number</span>
                <p>{admissionCard.seatNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="issued-info">
            <p><strong>Issued:</strong> {formatDate(admissionCard.issuedDate)}</p>
            <p><strong>Valid Until:</strong> {formatDate(admissionCard.validUntil)}</p>
          </div>
          <div className="share-count">
            <i className="ri-share-line"></i>
            <span>{admissionCard.shareCount || 0} shares</span>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${window.location.origin}/admission-cards/${admissionCard.cardId}`}
        title={`${admissionCard.examName} - Admission Card`}
        type="Admission Card"
        onShare={handleShare}
      />
    </div>
  );
}

export default AdmissionCard;