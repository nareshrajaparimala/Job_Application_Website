import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyApplications.css';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        setMessage('Application deleted successfully!');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      setMessage('Error deleting application');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'interview': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'ri-time-line';
      case 'approved': return 'ri-check-line';
      case 'rejected': return 'ri-close-line';
      case 'interview': return 'ri-user-voice-line';
      default: return 'ri-question-line';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status.toLowerCase() === filter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="applications-loading">
        <div className="loading-spinner"></div>
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="my-applications">
      <div className="applications-header">
        <div className="header-content">
          <h1 style={{color: '#ffffff'}}><i className="ri-file-list-3-line" style={{color: '#ffffff'}}></i> My Applications</h1>
          <p>Track your job applications and their current status</p>
        </div>
        <div className="applications-stats">
          <div className="stat-card">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'approved').length}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
      </div>

      <div className="applications-controls">
        <div className="search-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'rejected', 'interview'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="applications-grid">
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <i className="ri-inbox-line"></i>
            <h3>No applications found</h3>
            <p>Start applying to jobs to see them here!</p>
          </div>
        ) : (
          filteredApplications.map((application, index) => (
            <div key={application._id} className="application-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-header">
                <div className="job-info">
                  <h3>{application.jobTitle}</h3>
                  <p className="company">{application.company}</p>
                </div>
                <div className={`status-badge ${application.status.toLowerCase()}`}>
                  <i className={getStatusIcon(application.status)}></i>
                  {application.status}
                </div>
              </div>

              <div className="card-body">
                <div className="application-details">
                  <div className="detail-item">
                    <i className="ri-calendar-line"></i>
                    <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <i className="ri-map-pin-line"></i>
                    <span>{application.location}</span>
                  </div>
                  <div className="detail-item">
                    <i className="ri-money-dollar-circle-line"></i>
                    <span>{application.salary}</span>
                  </div>
                </div>

                {application.adminNote && (
                  <div className="admin-note">
                    <div className="note-header">
                      <i className="ri-message-3-line"></i>
                      <span>Admin Note</span>
                    </div>
                    <p>{application.adminNote}</p>
                  </div>
                )}

                {application.interviewDate && (
                  <div className="interview-info">
                    <i className="ri-calendar-event-line"></i>
                    <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: application.status === 'pending' ? '25%' : 
                             application.status === 'interview' ? '75%' : 
                             application.status === 'approved' ? '100%' : '0%',
                      backgroundColor: getStatusColor(application.status)
                    }}
                  ></div>
                </div>
                <div className="card-actions">
                  <button className="action-btn view-btn">
                    <i className="ri-eye-line"></i>
                    View Details
                  </button>
                  {application.status === 'interview' && (
                    <button className="action-btn interview-btn">
                      <i className="ri-video-line"></i>
                      Join Interview
                    </button>
                  )}
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteApplication(application._id)}
                    title="Delete Application"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyApplications;