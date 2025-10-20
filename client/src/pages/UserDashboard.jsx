import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [portfolioRequests, setPortfolioRequests] = useState([]);
  const [govExamApplications, setGovExamApplications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboardData();
    fetchPortfolioRequests();
    fetchGovExamApplications();
    
    // Listen for government exam application updates
    const handleGovExamUpdate = () => {
      fetchGovExamApplications();
      fetchDashboardData();
    };
    
    window.addEventListener('govExamApplicationUpdate', handleGovExamUpdate);
    
    return () => {
      window.removeEventListener('govExamApplicationUpdate', handleGovExamUpdate);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/dashboard/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Fallback data if API fails
        setDashboardData({
          stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
          applications: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data if API fails
      setDashboardData({
        stats: { total: 0, pending: 0, approved: 0, rejected: 0 },
        applications: []
      });
    }
  };

  const fetchPortfolioRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/portfolio/user-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPortfolioRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching portfolio requests:', error);
    }
  };

  const fetchGovExamApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setGovExamApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching gov exam applications:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'completed': return '#4CAF50';
      case 'rejected':
      case 'cancelled': return '#f44336';
      case 'in-progress': return '#2196F3';
      default: return '#ff9800';
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Application deleted successfully');
        fetchDashboardData();
      } else {
        alert('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    }
  };

  if (!dashboardData) {
    return (
      <div className="loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}!</h1>
          <p>Track your applications and stay updated</p>
        </div>
        
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="status-bars">
          <h2>Application Status Overview</h2>
          <div className="status-bar-container">
            <div className="status-bar">
              <div className="bar-label">Pending</div>
              <div className="bar">
                <div 
                  className="bar-fill pending" 
                  style={{ width: `${(dashboardData.stats.pending / dashboardData.stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="bar-percentage">{dashboardData.stats.pending}</div>
            </div>
            
            <div className="status-bar">
              <div className="bar-label">Approved</div>
              <div className="bar">
                <div 
                  className="bar-fill approved" 
                  style={{ width: `${(dashboardData.stats.approved / dashboardData.stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="bar-percentage">{dashboardData.stats.approved}</div>
            </div>
            
            <div className="status-bar">
              <div className="bar-label">Rejected</div>
              <div className="bar">
                <div 
                  className="bar-fill rejected" 
                  style={{ width: `${(dashboardData.stats.rejected / dashboardData.stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="bar-percentage">{dashboardData.stats.rejected}</div>
            </div>
          </div>
        </section>

        <section className="applications-list">
          <h2>Your Applications</h2>
          {(dashboardData.applications.length === 0 && (!dashboardData.jobApplications || dashboardData.jobApplications.length === 0)) ? (
            <div className="no-applications">
              <p>No applications yet. Start applying!</p>
              <a href="/jobs/private" className="apply-btn">Browse Jobs</a>
              <a href="/admissions" className="apply-btn" style={{marginLeft: '10px'}}>Browse Colleges</a>
            </div>
          ) : (
            <div className="applications-grid">
              {/* Job Applications */}
              {dashboardData.jobApplications && dashboardData.jobApplications.map(app => (
                <div key={app._id} className="application-card">
                  <div className="card-header">
                    <h3>{app.jobTitle || 'Job Application'}</h3>
                    <div className="card-actions">
                      <span 
                        className={`status-badge ${app.status}`}
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.toUpperCase()}
                      </span>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteApplication(app._id)}
                        title="Delete Application"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>Company:</strong> {app.company || 'Not specified'}</p>
                    <p><strong>Location:</strong> {app.location || 'Not specified'}</p>
                    <p><strong>Salary:</strong> {app.salary || 'Not disclosed'}</p>
                    <p><strong>Applied:</strong> {new Date(app.appliedDate).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(app.updatedAt).toLocaleDateString()}</p>
                    {app.adminNote && (
                      <p><strong>Admin Note:</strong> {app.adminNote}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {/* College Applications */}
              {dashboardData.applications.map(app => (
                <div key={app._id} className="application-card">
                  <div className="card-header">
                    <h3>{app.collegeName}</h3>
                    <div className="card-actions">
                      <span 
                        className={`status-badge ${app.status}`}
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.toUpperCase()}
                      </span>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteApplication(app._id)}
                        title="Delete Application"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(app.updatedAt).toLocaleDateString()}</p>
                    {app.collegeData && app.collegeData.courses && (
                      <p><strong>Courses:</strong> {app.collegeData.courses.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="gov-exam-applications">
          <h2>Government Exam Applications</h2>
          {govExamApplications.length === 0 ? (
            <div className="no-applications">
              <p>No government exam applications yet.</p>
              <a href="/gov-exams" className="apply-btn">Browse Government Exams</a>
            </div>
          ) : (
            <div className="applications-grid">
              {govExamApplications.map(app => (
                <div key={app._id} className="application-card">
                  <div className="card-header">
                    <h3>{app.examName}</h3>
                    <div className="card-actions">
                      <span 
                        className={`status-badge ${app.status}`}
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>Exam Date:</strong> {app.examDetails.examDate}</p>
                    <p><strong>Total Posts:</strong> {app.examDetails.totalPosts}</p>
                    <p><strong>Age Limit:</strong> {app.examDetails.ageLimit}</p>
                    <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(app.updatedAt).toLocaleDateString()}</p>
                    {app.notes && (
                      <p><strong>Admin Note:</strong> {app.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="portfolio-requests">
          <h2>Portfolio Requests</h2>
          {portfolioRequests.length === 0 ? (
            <div className="no-requests">
              <p>No portfolio requests yet.</p>
              <a href="/portfolio" className="apply-btn">Create Portfolio</a>
            </div>
          ) : (
            <div className="requests-grid">
              {portfolioRequests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="card-header">
                    <h3>{request.templateType === 'predefined' ? 'Predefined Template' : 'Customized Template'}</h3>
                    <span className={`status-badge ${request.status}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Theme:</strong> {request.theme}</p>
                    <p><strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleDateString()}</p>
                    <p><strong>Price:</strong> {request.templateType === 'predefined' ? '₹500/year' : '₹1500/year'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section className="resume-applications">
          <h2>Resume Applications</h2>
          {dashboardData.resumeApplications?.length === 0 ? (
            <div className="no-applications">
              <p>No resume applications yet.</p>
              <a href="/documents" className="apply-btn">Browse Resume Templates</a>
            </div>
          ) : (
            <div className="applications-grid">
              {dashboardData.resumeApplications?.map(app => (
                <div key={app._id} className="application-card">
                  <div className="card-header">
                    <h3>{app.templateId?.name || 'Resume Template'}</h3>
                    <div className="card-actions">
                      <span 
                        className={`status-badge ${app.status}`}
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p><strong>Template:</strong> {app.templateId?.name}</p>
                    <p><strong>Amount:</strong> ₹{app.totalAmount}</p>
                    <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(app.updatedAt || app.appliedAt).toLocaleDateString()}</p>
                    {app.notes && (
                      <p><strong>Admin Note:</strong> {app.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="notifications">
          <h2>Notifications</h2>
          <div className="notification-list">
            {/* Job Application Notifications */}
            {dashboardData.jobApplications && dashboardData.jobApplications
              .filter(app => app.status !== 'pending')
              .slice(0, 2)
              .map(app => (
                <div key={app._id} className="notification-item">
                  <div className="notification-icon">
                    {app.status === 'approved' ? <i className="ri-check-line"></i> : app.status === 'interview' ? <i className="ri-phone-line"></i> : <i className="ri-close-line"></i>}
                  </div>
                  <div className="notification-content">
                    <p>Your job application for <strong>{app.jobTitle}</strong> at <strong>{app.company}</strong> has been {app.status}</p>
                    <small>{new Date(app.updatedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            
            {/* College Application Notifications */}
            {dashboardData.applications
              .filter(app => app.status !== 'pending')
              .slice(0, 1)
              .map(app => (
                <div key={app._id} className="notification-item">
                  <div className="notification-icon">
                    {app.status === 'approved' ? <i className="ri-check-line"></i> : <i className="ri-close-line"></i>}
                  </div>
                  <div className="notification-content">
                    <p>Your application to <strong>{app.collegeName}</strong> has been {app.status}</p>
                    <small>{new Date(app.updatedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            
            {(!dashboardData.jobApplications || dashboardData.jobApplications.filter(app => app.status !== 'pending').length === 0) && 
             dashboardData.applications.filter(app => app.status !== 'pending').length === 0 && (
              <p className="no-notifications">No notifications yet</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;