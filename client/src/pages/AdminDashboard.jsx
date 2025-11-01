import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AddContentForm from '../components/Admin/AddContentForm';
import TemplateEditModal from '../components/Admin/TemplateEditModal';
import ContentManager from '../components/Admin/ContentManager';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(null);
  const [applicationType, setApplicationType] = useState('general');
  const [templates, setTemplates] = useState([]);
  const [portfolioRequests, setPortfolioRequests] = useState([]);
  const [govExamApplications, setGovExamApplications] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [usersWithResumes, setUsersWithResumes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchTemplates();
    fetchPortfolioRequests();
    fetchGovExamApplications();
    fetchUsersWithResumes();
    
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Fallback data if API fails
        setDashboardData({
          stats: { totalUsers: 0, totalApplications: 0, pendingApplications: 0 },
          users: [],
          applications: [],
          resumeApplications: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data if API fails
      setDashboardData({
        stats: { totalUsers: 0, totalApplications: 0, pendingApplications: 0 },
        users: [],
        applications: [],
        resumeApplications: []
      });
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

  const fetchGovExamApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/all-applications`, {
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

  const fetchUsersWithResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/resume-upload/admin/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUsersWithResumes(data.users);
      }
    } catch (error) {
      console.error('Error fetching users with resumes:', error);
    }
  };

  const updateGovExamStatus = async (applicationId, status, notes = '') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/update-status/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes })
      });
      fetchGovExamApplications();
      fetchDashboardData();
      // Trigger global update event
      window.dispatchEvent(new CustomEvent('govExamApplicationUpdate'));
    } catch (error) {
      console.error('Error updating gov exam status:', error);
    }
  };
  
  const updateResumeAppStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/resume/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating resume app status:', error);
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
        Loading Admin Dashboard...
      </div>
    );
  }

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
          <div className="stat-card">
            <h3>{govExamApplications.length}</h3>
            <p>Gov Exam Applications</p>
          </div>
          <div className="stat-card">
            <h3>{usersWithResumes.length}</h3>
            <p>Users with Resumes</p>
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
        <button 
          className={activeTab === 'manage-jobs' ? 'active' : ''} 
          onClick={() => setActiveTab('manage-jobs')}
        >
          Manage Jobs
        </button>
        <button 
          className={activeTab === 'manage-internships' ? 'active' : ''} 
          onClick={() => setActiveTab('manage-internships')}
        >
          Manage Internships
        </button>
        <button 
          className={activeTab === 'manage-webinars' ? 'active' : ''} 
          onClick={() => setActiveTab('manage-webinars')}
        >
          Manage Webinars
        </button>
        <button 
          className={activeTab === 'gov-exams' ? 'active' : ''} 
          onClick={() => setActiveTab('gov-exams')}
        >
          Gov Exam Applications
        </button>
        <button 
          className={activeTab === 'resume-apps' ? 'active' : ''} 
          onClick={() => setActiveTab('resume-apps')}
        >
          Resume Applications
        </button>
        <button 
          className={activeTab === 'user-resumes' ? 'active' : ''} 
          onClick={() => setActiveTab('user-resumes')}
        >
          User Resumes
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
                        <div className="admin-actions">
                          <select 
                            value={app.status} 
                            onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="interview">Interview</option>
                          </select>
                          <button 
                            className="delete-btn-admin"
                            onClick={() => deleteApplication(app._id)}
                            title="Delete Application"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
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
          onSuccess={() => {
            fetchDashboardData();
            // Trigger refresh of content lists
            window.dispatchEvent(new CustomEvent('refreshContent', { detail: { type: showAddForm } }));
          }}
        />
      )}
      
      {editingTemplate && (
        <TemplateEditModal 
          template={editingTemplate}
          onSave={handleTemplateSave}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {activeTab === 'manage-jobs' && (
        <ContentManager type="jobs" />
      )}

      {activeTab === 'manage-internships' && (
        <ContentManager type="internships" />
      )}

      {activeTab === 'manage-webinars' && (
        <ContentManager type="webinars" />
      )}

      {activeTab === 'gov-exams' && (
        <div className="gov-exams-section">
          <h2>Government Exam Applications Management</h2>
          <div className="gov-exams-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Exam Name</th>
                  <th>Exam Date</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {govExamApplications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div>
                        <strong>{app.userDetails.name}</strong>
                        <br />
                        <small>{app.userDetails.email}</small>
                        <br />
                        <small>{app.userDetails.phone}</small>
                      </div>
                    </td>
                    <td>{app.examName}</td>
                    <td>{app.examDetails.examDate}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${app.status}`}>{app.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <select 
                          value={app.status} 
                          onChange={(e) => updateGovExamStatus(app._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="view-details-btn"
                          onClick={() => {
                            const details = `Exam: ${app.examName}\nUser: ${app.userDetails.name}\nEmail: ${app.userDetails.email}\nPhone: ${app.userDetails.phone}\nExam Date: ${app.examDetails.examDate}\nTotal Posts: ${app.examDetails.totalPosts}\nAge Limit: ${app.examDetails.ageLimit}\nApplication Fee: ${app.examDetails.applicationFee}\nApplied: ${new Date(app.appliedAt).toLocaleDateString()}\nStatus: ${app.status}\nNotes: ${app.notes || 'No notes'}`;
                            alert(details);
                          }}
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'resume-apps' && (
        <div className="resume-apps-section">
          <h2>Resume Applications Management</h2>
          <div className="resume-apps-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Template</th>
                  <th>Amount</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.resumeApplications?.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div>
                        <strong>{app.userId?.firstName} {app.userId?.lastName}</strong>
                        <br />
                        <small>{app.userId?.email}</small>
                        <br />
                        <small>{app.userId?.phone}</small>
                      </div>
                    </td>
                    <td>{app.templateId?.name || 'Template'}</td>
                    <td>₹{app.totalAmount}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${app.status}`}>{app.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <select 
                          value={app.status} 
                          onChange={(e) => updateResumeAppStatus(app._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="view-details-btn"
                          onClick={() => {
                            const details = `Template: ${app.templateId?.name}\nUser: ${app.userId?.firstName} ${app.userId?.lastName}\nEmail: ${app.userId?.email}\nPhone: ${app.userId?.phone}\nAmount: ₹${app.totalAmount}\nApplied: ${new Date(app.appliedAt).toLocaleDateString()}\nStatus: ${app.status}\nUser Details: ${JSON.stringify(app.userDetails, null, 2)}`;
                            alert(details);
                          }}
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'user-resumes' && (
        <div className="user-resumes-section">
          <h2>User Resumes Management</h2>
          <div className="user-resumes-table">
            <table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Resume File</th>
                  <th>Uploaded Date</th>
                  <th>Profile Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithResumes.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <strong>{user.firstName} {user.lastName}</strong>
                        <br />
                        <small>{user.email}</small>
                        <br />
                        <small>{user.phone}</small>
                        <br />
                        <small>Gender: {user.gender}</small>
                      </div>
                    </td>
                    <td>
                      <div className="resume-file-info">
                        <i className="ri-file-text-line"></i>
                        <span>{user.resumeFileName}</span>
                      </div>
                    </td>
                    <td>{new Date(user.resumeUploadedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="profile-info">
                        {user.address && <div><strong>Address:</strong> {user.address}, {user.city}, {user.state}</div>}
                        {user.skills && user.skills.length > 0 && <div><strong>Skills:</strong> {user.skills.join(', ')}</div>}
                        {user.experience && <div><strong>Experience:</strong> {user.experience}</div>}
                        {user.education && <div><strong>Education:</strong> {user.education}</div>}
                        <div><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="download-resume-btn"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/admin/download/${user._id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              
                              if (response.ok) {
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${user.firstName}_${user.lastName}_Resume.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } else {
                                alert('Download failed');
                              }
                            } catch (error) {
                              alert('Download failed');
                            }
                          }}
                          title="Download Resume"
                        >
                          <i className="ri-download-line"></i> Download
                        </button>
                        <button 
                          className="view-profile-btn"
                          onClick={() => {
                            const profileDetails = `Name: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone}\nGender: ${user.gender}\nAddress: ${user.address || 'Not provided'}, ${user.city || ''}, ${user.state || ''}\nSkills: ${user.skills?.join(', ') || 'Not provided'}\nExperience: ${user.experience || 'Not provided'}\nEducation: ${user.education || 'Not provided'}\nResume: ${user.resumeFileName}\nUploaded: ${new Date(user.resumeUploadedAt).toLocaleDateString()}\nJoined: ${new Date(user.createdAt).toLocaleDateString()}`;
                            alert(profileDetails);
                          }}
                          title="View Full Profile"
                        >
                          <i className="ri-eye-line"></i> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;