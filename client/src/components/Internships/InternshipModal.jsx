import React from 'react';

function InternshipModal({ internship, isOpen, onClose }) {
  if (!isOpen || !internship) return null;

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internships/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internship }),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        onClose();
      } else {
        alert('Failed to apply');
      }
    } catch (error) {
      alert('Error applying to internship');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{internship.title}</h2>
            <p className="company-name">{internship.company}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="internship-overview">
            <div className="overview-item">
              <i className="ri-map-pin-line"></i>
              <div>
                <strong>Location</strong>
                <p>{internship.location}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-time-line"></i>
              <div>
                <strong>Duration</strong>
                <p>{internship.duration}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-money-rupee-circle-line"></i>
              <div>
                <strong>Stipend</strong>
                <p>{internship.stipend}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-briefcase-line"></i>
              <div>
                <strong>Work Mode</strong>
                <p>{internship.workMode}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>About the Internship</h3>
            <p>{internship.description}</p>
          </div>

          <div className="section">
            <h3>Requirements</h3>
            <ul>
              {internship.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Skills Required</h3>
            <div className="skills-list">
              {internship.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Benefits</h3>
            <ul>
              {internship.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="internship-dates">
            <p><strong>Posted:</strong> {new Date(internship.datePosted).toLocaleDateString()}</p>
            <p><strong>Application Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="apply-btn-modal" onClick={handleApply}>
            <i className="ri-send-plane-line"></i>
            Apply for this Internship
          </button>
        </div>
      </div>
    </div>
  );
}

export default InternshipModal;