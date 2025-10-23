import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import './JobCard.css';

function JobCard({ job, onClick }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (salary.includes('-')) {
      return `₹${salary.replace('-', ' - ₹')}`;
    }
    return `₹${salary}`;
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <>
    <div className="job-card" onClick={() => onClick(job)}>
      <div className="job-card-header">
        <div className="company-logo-section">
          <div className="company-logo">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={`${job.company} logo`} />
            ) : (
              <div className="default-logo">
                <i className="ri-building-line"></i>
              </div>
            )}
          </div>
        </div>
        <div className="job-title-section">
          <h3 className="job-title">{job.title || 'Job Title'}</h3>
          <p className="company-name">{job.company || 'Company'}</p>
        </div>
        <div className="deadline-badge">
          <span className={`deadline ${getDaysLeft(job.deadline).includes('Expired') ? 'expired' : ''}`}>
            {getDaysLeft(job.deadline)}
          </span>
        </div>
      </div>

      <div className="job-description">
        <p>{job.shortDescription || 'No description available'}</p>
      </div>

      <div className="job-details">
        <div className="job-meta">
          <span className="job-type">
            <i className="ri-briefcase-line"></i>
            {job.jobType || 'Full-time'}
          </span>
          <span className="job-location">
            <i className="ri-map-pin-line"></i>
            {job.location || 'Location not specified'}
          </span>
          <span className="job-salary">
            <i className="ri-money-dollar-circle-line"></i>
            {formatSalary(job.salary)}
          </span>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-posted">
          <i className="ri-time-line"></i>
          Posted {job.postedDate || 'Recently'}
        </div>
        <div className="job-actions">
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
              if (job.applicationLink) {
                window.open(job.applicationLink, '_blank');
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
                if (window.showPopup) {
                  window.showPopup('Link copied!', 'success');
                } else {
                  alert('Job link copied to clipboard!');
                }
              }
            }}
          >
            <i className="ri-external-link-line"></i>
            Get Link
          </button>
          <button className="apply-btn">
            <i className="ri-send-plane-line"></i>
            Apply
          </button>
        </div>
      </div>
    </div>
    
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareUrl={`${window.location.origin}/job/${job.id}`}
      title={job.title}
      type="Job"
    />
    </>
  );
}

export default JobCard;