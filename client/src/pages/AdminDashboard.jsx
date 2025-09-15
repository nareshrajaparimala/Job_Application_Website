import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AddContentForm from '../components/Admin/AddContentForm';
import TemplateEditModal from '../components/Admin/TemplateEditModal';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(null);
  const [applicationType, setApplicationType] = useState('general');
  const [templates, setTemplates] = useState([]);
  const [portfolioRequests, setPortfolioRequests] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTemplates();
    fetchPortfolioRequests();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/dashboard/application-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, status })
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/resume/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateEdit = (template) => {
    setEditingTemplate(template);
  };

  const handleTemplateSave = async (templateData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingTemplate 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/resume/templates/${editingTemplate._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/resume/templates`;
      
      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        fetchTemplates();
        setEditingTemplate(null);
        alert('Template saved successfully!');
      }
    } catch (error) {
      alert('Error saving template');
    }
  };

  const handleTemplateDelete = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/resume/templates/${templateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchTemplates();
        alert('Template deleted successfully!');
      }
    } catch (error) {
      alert('Error deleting template');
    }
  };

  const fetchPortfolioRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/portfolio/admin/all-requests`, {
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

  const updatePortfolioStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/portfolio/admin/update-status/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchPortfolioRequests();
    } catch (error) {
      console.error('Error updating portfolio status:', error);
    }
  };

  if (!dashboardData) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>{dashboardData.stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData.stats.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData.stats.pendingApplications}</h3>
            <p>Pending Applications</p>
          </div>
          <div className="stat-card">
            <h3>{portfolioRequests.length}</h3>
            <p>Portfolio Requests</p>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'applications' ? 'active' : ''} 
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button 
          className={activeTab === 'templates' ? 'active' : ''} 
          onClick={() => setActiveTab('templates')}
        >
          Resume Templates
        </button>
        <button 
          className={activeTab === 'portfolio' ? 'active' : ''} 
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio Requests
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.users.map(user => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.gender}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-section">
            <h2>Application Management</h2>
            <div className="applications-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>College</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.applications.map(app => (
                    <tr key={app._id}>
                      <td>
                        <div>
                          <strong>{app.userId.firstName} {app.userId.lastName}</strong>
                          <br />
                          <small>{app.userId.email}</small>
                          <br />
                          <small>{app.userId.phone}</small>
                        </div>
                      </td>
                      <td>{app.collegeName}</td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${app.status}`}>{app.status}</span>
                      </td>
                      <td>
                        <select 
                          value={app.status} 
                          onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>System Overview</h2>
            <div className="add-content-buttons">
              <button onClick={() => setShowAddForm('job')} className="add-btn">
                <i className="ri-briefcase-line"></i> Add Job
              </button>
              <button onClick={() => setShowAddForm('webinar')} className="add-btn">
                <i className="ri-presentation-line"></i> Add Webinar
              </button>
              <button onClick={() => setShowAddForm('internship')} className="add-btn">
                <i className="ri-user-star-line"></i> Add Internship
              </button>
              <button onClick={() => setShowAddForm('college')} className="add-btn">
                <i className="ri-school-line"></i> Add College
              </button>
              <button onClick={() => setShowAddForm('resume-template')} className="add-btn">
                <i className="ri-file-text-line"></i> Add Resume Template
              </button>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Applications</h3>
                <ul>
                  {dashboardData.applications.slice(0, 5).map(app => (
                    <li key={app._id}>
                      {app.userId.firstName} applied to {app.collegeName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overview-card">
                <h3>New Users</h3>
                <ul>
                  {dashboardData.users.slice(0, 5).map(user => (
                    <li key={user._id}>
                      {user.firstName} {user.lastName} - {user.email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="section-header">
              <h2>Resume Templates Management</h2>
              <button 
                className="add-template-btn"
                onClick={() => setEditingTemplate({})}
              >
                <i className="ri-add-line"></i> Add New Template
              </button>
            </div>
            
            <div className="templates-grid">
              {templates.map(template => (
                <div key={template._id} className="template-admin-card">
                  <div className="template-image">
                    <img src={template.templateImage || '/api/placeholder/200/250'} alt={template.name} />
                  </div>
                  <div className="template-details">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="template-pricing">
                      <span>Price: ₹{template.price}</span>
                      <span>Customization: ₹{template.customizationPrice}</span>
                    </div>
                    <div className="template-status">
                      <span className={`status ${template.isActive ? 'active' : 'inactive'}`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="template-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleTemplateEdit(template)}
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleTemplateDelete(template._id)}
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="portfolio-section">
            <h2>Portfolio Requests Management</h2>
            <div className="portfolio-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Template Type</th>
                    <th>Theme</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioRequests.map(request => (
                    <tr key={request._id}>
                      <td>{request.name}</td>
                      <td>{request.email}</td>
                      <td>{request.mobile}</td>
                      <td>
                        <span className={`template-type ${request.templateType}`}>
                          {request.templateType === 'predefined' ? 'Predefined (₹500)' : 'Customized (₹1500)'}
                        </span>
                      </td>
                      <td>{request.theme}</td>
                      <td>{new Date(request.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${request.status}`}>{request.status}</span>
                      </td>
                      <td>
                        <select 
                          value={request.status} 
                          onChange={(e) => updatePortfolioStatus(request._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {showAddForm && (
        <AddContentForm 
          type={showAddForm} 
          onClose={() => setShowAddForm(null)}
          onSuccess={() => fetchDashboardData()}
        />
      )}
      
      {editingTemplate && (
        <TemplateEditModal 
          template={editingTemplate}
          onSave={handleTemplateSave}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;