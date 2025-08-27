import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      default: return '#ff9800';
    }
  };

  if (!dashboardData) return <div className="loading">Loading...</div>;

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
          {dashboardData.applications.length === 0 ? (
            <div className="no-applications">
              <p>No applications yet. Start applying to colleges!</p>
              <a href="/admissions" className="apply-btn">Browse Colleges</a>
            </div>
          ) : (
            <div className="applications-grid">
              {dashboardData.applications.map(app => (
                <div key={app._id} className="application-card">
                  <div className="card-header">
                    <h3>{app.collegeName}</h3>
                    <span 
                      className={`status-badge ${app.status}`}
                      style={{ backgroundColor: getStatusColor(app.status) }}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(app.updatedAt).toLocaleDateString()}</p>
                    {app.collegeData.courses && (
                      <p><strong>Courses:</strong> {app.collegeData.courses.join(', ')}</p>
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
            {dashboardData.applications
              .filter(app => app.status !== 'pending')
              .slice(0, 3)
              .map(app => (
                <div key={app._id} className="notification-item">
                  <div className="notification-icon">
                    {app.status === 'approved' ? '✅' : '❌'}
                  </div>
                  <div className="notification-content">
                    <p>Your application to <strong>{app.collegeName}</strong> has been {app.status}</p>
                    <small>{new Date(app.updatedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            {dashboardData.applications.filter(app => app.status !== 'pending').length === 0 && (
              <p className="no-notifications">No notifications yet</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;