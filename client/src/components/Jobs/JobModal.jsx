import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobModal.css';

function JobModal({ job, isOpen, onClose }) {
  const navigate = useNavigate();
  
  if (!isOpen || !job) return null;
  
  const handleApply = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert('Please login to apply for this job');
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        userEmail: userData.email,
        userName: userData.name || userData.email,
        userPhone: userData.phone || userData.mobile || 'Not provided',
        appliedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });
      
      if (response.ok) {
        alert('Application submitted successfully!');
        onClose();
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleGetLink = (e) => {
    e.stopPropagation();
    // Copy job link to clipboard or open external link
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    navigator.clipboard.writeText(jobUrl);
    alert('Job link copied to clipboard!');
  };

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
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>{job.title}</h2>
            <p className="modal-company">{job.company}</p>
          </div>
          <button className="close-modal" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="modal-content">
          <div className="job-overview">
            <h3>Overview</h3>
            <p>{job.overview}</p>
          </div>

          <div className="job-requirements">
            <h3>Requirements</h3>
            <ul>
              {job.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="job-skills">
            <h3>Skills & Experience</h3>
            <p>{job.skillsExperience}</p>
          </div>

          <div className="job-highlights">
            <h3>Job Highlights</h3>
            <div className="highlights-grid">
              {job.highlights?.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <i className="ri-check-line"></i>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="job-skills-tags">
            <h3>Skills</h3>
            <div className="skills-container">
              {job.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {job.photos && job.photos.length > 0 && (
            <div className="job-photos">
              <h3>Photos</h3>
              <div className="photos-grid">
                {job.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Job photo ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-insights">
          <h3>Job Role Insights</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <span className="insight-label">Date Posted</span>
              <span className="insight-value">{job.datePosted}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Closing Date</span>
              <span className="insight-value">{job.closingDate}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Hiring Location</span>
              <span className="insight-value">{job.location}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Offered Salary</span>
              <span className="insight-value">{formatSalary(job.salary)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Career Level</span>
              <span className="insight-value">{job.careerLevel}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Qualification</span>
              <span className="insight-value">{job.qualification}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Experience</span>
              <span className="insight-value">{job.experience}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Quantity</span>
              <span className="insight-value">{job.quantity}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <div className="deadline-info">
            <span className={`deadline-status ${getDaysLeft(job.deadline).includes('Expired') ? 'expired' : ''}`}>
              {getDaysLeft(job.deadline)}
            </span>
          </div>
          <div className="action-buttons">
            <button className="get-link-btn-modal" onClick={handleGetLink}>
              <i className="ri-external-link-line"></i>
              Get Link
            </button>
            <button className="apply-btn-modal" onClick={handleApply}>
              <i className="ri-send-plane-line"></i>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobModal;