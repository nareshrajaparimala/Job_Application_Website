import React from 'react';

function InternshipCard({ internship, onClick }) {
  const handleApply = async (e) => {
    e.stopPropagation();
    
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
      } else {
        alert('Failed to apply');
      }
    } catch (error) {
      alert('Error applying to internship');
    }
  };

  return (
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
        <button className="apply-btn" onClick={handleApply}>
          <i className="ri-send-plane-line"></i>
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default InternshipCard;