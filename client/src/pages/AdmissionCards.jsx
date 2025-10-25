import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdmissionCard from '../components/AdmissionCard/AdmissionCard';
import AdmissionCardModal from '../components/AdmissionCard/AdmissionCardModal';
import ShareModal from '../components/ShareModal/ShareModal';
import './AdmissionCards.css';

function AdmissionCards() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [admissionCards, setAdmissionCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    examName: '',
    candidateName: '',
    rollNumber: '',
    examDate: '',
    examTime: '',
    examCenter: '',
    centerAddress: '',
    reportingTime: '',
    examDuration: '',
    seatNumber: '',
    validUntil: ''
  });

  useEffect(() => {
    if (shareId) {
      fetchSharedCard(shareId);
    } else {
      fetchMyCards();
    }
  }, [shareId]);

  const fetchSharedCard = async (cardId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/share/${cardId}`);
      if (response.ok) {
        const result = await response.json();
        setSelectedCard(result.admissionCard);
        setShowCardModal(true);
      } else {
        if (window.showPopup) {
          window.showPopup('Admission card not found', 'error');
        }
        navigate('/admission-cards');
      }
    } catch (error) {
      console.error('Error fetching shared card:', error);
      if (window.showPopup) {
        window.showPopup('Error loading admission card', 'error');
      }
      navigate('/admission-cards');
    }
  };

  const fetchMyCards = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.showPopup) {
        window.showPopup('Please login to view your admission cards', 'warning');
      }
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/my-cards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAdmissionCards(result.admissionCards);
      }
    } catch (error) {
      console.error('Error fetching admission cards:', error);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setAdmissionCards(prev => [result.admissionCard, ...prev]);
        setShowCreateForm(false);
        setFormData({
          examName: '',
          candidateName: '',
          rollNumber: '',
          examDate: '',
          examTime: '',
          examCenter: '',
          centerAddress: '',
          reportingTime: '',
          examDuration: '',
          seatNumber: '',
          validUntil: ''
        });
        if (window.showPopup) {
          window.showPopup('Admission card created successfully!', 'success');
        }
      } else {
        throw new Error('Failed to create admission card');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to create admission card', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this admission card?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admission-cards/delete/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAdmissionCards(prev => prev.filter(card => card.cardId !== cardId));
        if (window.showPopup) {
          window.showPopup('Admission card deleted successfully!', 'success');
        }
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to delete admission card', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCloseModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
    if (shareId) {
      navigate('/admission-cards');
    }
  };

  if (shareId && selectedCard && !showCardModal) {
    return (
      <div className="admission-cards-page">
        <div className="shared-card-container">
          <div className="shared-card-header">
            <button onClick={() => navigate('/admission-cards')} className="back-btn">
              <i className="ri-arrow-left-line"></i> Back
            </button>
            <h1>Shared Admission Card</h1>
          </div>
          <AdmissionCard 
            admissionCard={selectedCard} 
            isOwner={false}
            onClick={handleCardClick}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admission-cards-page">
      <div className="page-header">
        <h1>My Admission Cards</h1>
        <button 
          className="create-card-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="ri-add-line"></i>
          Create New Card
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="create-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>Create Admission Card</h2>
              <button onClick={() => setShowCreateForm(false)} className="close-btn">×</button>
            </div>
            
            <form onSubmit={handleCreateCard} className="create-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Exam Name *</label>
                  <input
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Candidate Name *</label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Seat Number</label>
                  <input
                    type="text"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exam Date *</label>
                  <input
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Exam Time *</label>
                  <input
                    type="time"
                    name="examTime"
                    value={formData.examTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Reporting Time *</label>
                  <input
                    type="time"
                    name="reportingTime"
                    value={formData.reportingTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Exam Duration *</label>
                  <input
                    type="text"
                    name="examDuration"
                    value={formData.examDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 hours"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Exam Center *</label>
                <input
                  type="text"
                  name="examCenter"
                  value={formData.examCenter}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Center Address *</label>
                <textarea
                  name="centerAddress"
                  value={formData.centerAddress}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Valid Until *</label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cards-container">
        {admissionCards.length > 0 ? (
          admissionCards.map(card => (
            <AdmissionCard
              key={card.cardId}
              admissionCard={card}
              onDelete={handleDeleteCard}
              isOwner={true}
              onClick={handleCardClick}
            />
          ))
        ) : (
          <div className="no-cards">
            <i className="ri-file-list-line"></i>
            <h3>No admission cards found</h3>
            <p>Create your first admission card to get started</p>
          </div>
        )}
      </div>

      <AdmissionCardModal
        admissionCard={selectedCard}
        isOpen={showCardModal}
        onClose={handleCloseModal}
        onEdit={(card) => {
          console.log('Edit card:', card);
        }}
        onDelete={handleDeleteCard}
        isOwner={!shareId}
      />
    </div>
  );
}

export default AdmissionCards;