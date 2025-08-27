import React from 'react';
import './JobCard.css';

function JobCard({ job, onClick }) {
  const formatSalary = (salary) => {
    if (salary.includes('-')) {
      return `₹${salary.replace('-', ' - ₹')}`;
    }
    return `₹${salary}`;
  };

  const getDaysLeft = (deadline) => {
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
    <div className="job-card" onClick={() => onClick(job)}>
      <div className="job-card-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
        </div>
        <div className="deadline-badge">
          <span className={`deadline ${getDaysLeft(job.deadline).includes('Expired') ? 'expired' : ''}`}>
            {getDaysLeft(job.deadline)}
          </span>
        </div>
      </div>

      <div className="job-description">
        <p>{job.shortDescription}</p>
      </div>

      <div className="job-details">
        <div className="job-meta">
          <span className="job-type">
            <i className="ri-briefcase-line"></i>
            {job.jobType}
          </span>
          <span className="job-location">
            <i className="ri-map-pin-line"></i>
            {job.location}
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
          Posted {job.postedDate}
        </div>
        <div className="job-actions">
          <button className="get-link-btn">
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
  );
}

export default JobCard;