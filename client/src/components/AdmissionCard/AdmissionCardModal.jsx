import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import './AdmissionCardModal.css';

function AdmissionCardModal({ admissionCard, isOpen, onClose, onEdit, onDelete, isOwner = false }) {
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen || !admissionCard) return null;

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

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="admission-modal-overlay" onClick={onClose}>
      <div className="admission-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admission-modal-header">
          <div className="modal-title">
            <h2>Admission Card Details</h2>
            <div className="card-id-modal">ID: {admissionCard.cardId}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="admission-modal-body">
          <div className="exam-section">
            <div className="section-header">
              <i className="ri-file-text-line"></i>
              <h3>Exam Information</h3>
            </div>
            <div className="exam-title">{admissionCard.examName}</div>
          </div>

          <div className="candidate-section">
            <div className="section-header">
              <i className="ri-user-line"></i>
              <h3>Candidate Details</h3>
            </div>
            <div className="candidate-details">
              <div className="detail-item-modal">
                <span>Candidate Name</span>
                <p>{admissionCard.candidateName}</p>
              </div>
              <div className="detail-item-modal">
                <span>Roll Number</span>
                <p>{admissionCard.rollNumber}</p>
              </div>
              {admissionCard.seatNumber && (
                <div className="detail-item-modal">
                  <span>Seat Number</span>
                  <p>{admissionCard.seatNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="exam-schedule-section">
            <div className="section-header">
              <i className="ri-calendar-line"></i>
              <h3>Exam Schedule</h3>
            </div>
            <div className="schedule-grid">
              <div className="detail-item-modal">
                <span>Exam Date</span>
                <p>{formatDate(admissionCard.examDate)}</p>
              </div>
              <div className="detail-item-modal">
                <span>Exam Time</span>
                <p>{admissionCard.examTime}</p>
              </div>
              <div className="detail-item-modal">
                <span>Reporting Time</span>
                <p>{admissionCard.reportingTime}</p>
              </div>
              <div className="detail-item-modal">
                <span>Duration</span>
                <p>{admissionCard.examDuration}</p>
              </div>
            </div>
          </div>

          <div className="venue-section">
            <div className="section-header">
              <i className="ri-map-pin-line"></i>
              <h3>Exam Venue</h3>
            </div>
            <div className="venue-details">
              <div className="detail-item-modal">
                <span>Exam Center</span>
                <p>{admissionCard.examCenter}</p>
              </div>
              <div className="detail-item-modal full-width">
                <span>Center Address</span>
                <p>{admissionCard.centerAddress}</p>
              </div>
            </div>
          </div>

          {(admissionCard.instructions?.length > 0 || admissionCard.documentsRequired?.length > 0) && (
            <div className="instructions-section">
              <div className="section-header">
                <i className="ri-information-line"></i>
                <h3>Important Information</h3>
              </div>
              
              {admissionCard.instructions?.length > 0 && (
                <div className="info-subsection">
                  <h4>Instructions</h4>
                  <ul>
                    {admissionCard.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {admissionCard.documentsRequired?.length > 0 && (
                <div className="info-subsection">
                  <h4>Documents Required</h4>
                  <ul>
                    {admissionCard.documentsRequired.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="validity-section">
            <div className="section-header">
              <i className="ri-calendar-check-line"></i>
              <h3>Card Validity</h3>
            </div>
            <div className="validity-details">
              <div className="detail-item-modal">
                <span>Issued Date</span>
                <p>{formatDate(admissionCard.issuedDate)}</p>
              </div>
              <div className="detail-item-modal">
                <span>Valid Until</span>
                <p>{formatDate(admissionCard.validUntil)}</p>
              </div>
              <div className="detail-item-modal">
                <span>Share Count</span>
                <p>{admissionCard.shareCount || 0} times</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admission-modal-footer">
          <button 
            className="share-btn-modal"
            onClick={() => setShowShareModal(true)}
          >
            <i className="ri-share-line"></i>
            Share Card
          </button>
          
          {isOwner && (
            <>
              <button 
                className="edit-btn-modal"
                onClick={() => {
                  onEdit(admissionCard);
                  onClose();
                }}
              >
                <i className="ri-edit-line"></i>
                Edit Card
              </button>
              <button 
                className="delete-btn-modal"
                onClick={() => {
                  onDelete(admissionCard.cardId);
                  onClose();
                }}
              >
                <i className="ri-delete-bin-line"></i>
                Delete Card
              </button>
            </>
          )}
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

export default AdmissionCardModal;