import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShareModal from '../components/ShareModal/ShareModal';
import './GovExamDetail.css';

function GovExamDetail() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sampleExams = [
    {
      id: 1,
      postName: "SSC Delhi Police Head Constable (Staff Selection Commission)",
      startDate: "2025-09-29",
      endDate: "2025-10-20",
      examDate: "December 2025 - January 2026",
      admitCardDate: "Before Exam",
      resultDate: "To be updated",
      applicationFee: "*General,OBC,EWS -₹100 *SC,ST,PWD-₹00",
      ageLimit: "18-25",
      totalPosts: "509",
      eligibility: "*Candidates must have passed 10+2 (Senior Secondary) or equivalent examination from a recognized board. *Must possess a typing speed of 30 words per minute in English OR 25 words per minute in Hindi on computer.",
      applyLink: "https://ssc.gov.in/",
      selectionMode: "CBT, PE & MT, Trade Test, Document Verification, Medical Examination"
    }
  ];

  useEffect(() => {
    fetchExamDetail();
  }, [id]);

  const fetchExamDetail = async () => {
    try {
      // Try to fetch from API first
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/detail/${id}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data.exam);
      } else {
        // Fallback to sample data
        const foundExam = sampleExams.find(e => e.id.toString() === id);
        setExam(foundExam);
      }
    } catch (error) {
      // Fallback to sample data
      const foundExam = sampleExams.find(e => e.id.toString() === id);
      setExam(foundExam);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpApply = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      if (window.showPopup) {
        window.showPopup('Please login to get help', 'warning');
      }
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/help-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          examDetails: exam,
          userDetails: user
        })
      });

      const result = await response.json();

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup('Help request sent successfully!', 'success');
        }
      } else if (response.status === 409) {
        if (window.showPopup) {
          window.showPopup('You have already applied for this exam!', 'warning');
        }
      } else {
        throw new Error(result.message || 'Failed to send help request');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to send help request', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading exam details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="error-container">
        <h2>Exam Not Found</h2>
        <p>The requested government exam could not be found.</p>
        <a href="/gov-exams" className="back-btn">Back to Government Exams</a>
      </div>
    );
  }

  return (
    <div className="gov-exam-detail-page">
      <div className="exam-detail-container">
        <div className="exam-detail-header">
          <a href="/gov-exams" className="back-link">
            <i className="ri-arrow-left-line"></i> Back to Government Exams
          </a>
          <h1>{exam.postName}</h1>
        </div>

        <div className="exam-detail-content">
          <div className="exam-details-grid">
            <div className="detail-card">
              <h3>Important Dates</h3>
              <div className="date-info">
                <p><strong>Application Start:</strong> {new Date(exam.startDate).toLocaleDateString()}</p>
                <p><strong>Application End:</strong> {new Date(exam.endDate).toLocaleDateString()}</p>
                <p><strong>Exam Date:</strong> {exam.examDate}</p>
                <p><strong>Admit Card:</strong> {exam.admitCardDate}</p>
                <p><strong>Result:</strong> {exam.resultDate}</p>
              </div>
            </div>

            <div className="detail-card">
              <h3>Application Details</h3>
              <p><strong>Application Fee:</strong> {exam.applicationFee}</p>
              <p><strong>Age Limit:</strong> {exam.ageLimit} years</p>
              <p><strong>Total Posts:</strong> {exam.totalPosts}</p>
            </div>

            <div className="detail-card full-width">
              <h3>Eligibility Criteria</h3>
              <p>{exam.eligibility}</p>
            </div>

            <div className="detail-card full-width">
              <h3>Selection Process</h3>
              <p>{exam.selectionMode}</p>
            </div>
          </div>

          <div className="exam-actions">
            <button 
              className="share-btn"
              onClick={handleShare}
            >
              <i className="ri-share-line"></i>
              Share
            </button>
            
            <button 
              className="official-link-btn"
              onClick={() => window.open(exam.applyLink, '_blank')}
            >
              <i className="ri-external-link-line"></i>
              Visit Official Website
            </button>
            
            <button 
              className="help-apply-btn"
              onClick={handleHelpApply}
              disabled={isLoading}
            >
              <i className={isLoading ? "ri-loader-4-line" : "ri-customer-service-line"}></i>
              {isLoading ? 'Sending...' : 'Get Help to Apply'}
            </button>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
        title={exam.postName}
        type="Government Exam"
      />
    </div>
  );
}

export default GovExamDetail;