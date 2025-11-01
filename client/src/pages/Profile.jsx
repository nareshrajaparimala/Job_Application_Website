import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ResumeManager from '../components/Resume/ResumeManager';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profilePhoto: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchResumeInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumeInfo(response.data);
    } catch (error) {
      console.error('Error fetching resume info:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/upload-photo`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile(prev => ({ ...prev, profilePhoto: response.data.photoUrl }));
      
      // Update navbar profile photo
      const user = JSON.parse(localStorage.getItem('user'));
      user.profilePhoto = response.data.photoUrl;
      localStorage.setItem('user', JSON.stringify(user));
      
      setMessage('Profile photo updated successfully!');
    } catch (error) {
      setMessage('Error uploading photo');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ 
        ...prev, 
        skills: [...prev.skills, newSkill.trim()] 
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update localStorage user info
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = `${profile.firstName} ${profile.lastName}`;
      localStorage.setItem('user', JSON.stringify(user));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-photo-section">
              <div className="profile-photo">
                {profile.profilePhoto ? (
                  <img 
                    src={profile.profilePhoto} 
                    alt="User Profile Picture" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="default-avatar" style={{ display: profile.profilePhoto ? 'none' : 'flex' }}>
                  <i className="ri-user-line"></i>
                </div>
                <div className="photo-upload-overlay">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-btn">
                    <i className="ri-camera-line"></i>
                  </label>
                </div>
              </div>
              <div className="profile-info">
                <h1>{profile.firstName} {profile.lastName}</h1>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-bio">{profile.bio || 'No bio added yet'}</p>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <i className="ri-edit-line"></i> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={saving}>
                    <i className="ri-save-line"></i> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    <i className="ri-close-line"></i> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="ri-user-line"></i> Personal Info
          </button>
          <button 
            className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            <i className="ri-briefcase-line"></i> Professional
          </button>
          <button 
            className={`tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <i className="ri-links-line"></i> Social Links
          </button>
          <button 
            className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <i className="ri-file-text-line"></i> Resume
          </button>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {activeTab === 'personal' && (
            <div className="tab-content personal-info">
              <div className="form-grid">
                <div className="form-group">
                  <label><i className="ri-user-line"></i> First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-user-line"></i> Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-mail-line"></i> Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-phone-line"></i> Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-calendar-line"></i> Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-user-2-line"></i> Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label><i className="ri-map-pin-line"></i> Address</label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-building-line"></i> City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-map-line"></i> State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-mail-send-line"></i> Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group full-width">
                  <label><i className="ri-file-text-line"></i> Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="tab-content professional-info">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label><i className="ri-tools-line"></i> Skills</label>
                  <div className="skills-section">
                    <div className="skills-input">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        disabled={!isEditing}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <button 
                        type="button" 
                        onClick={addSkill}
                        disabled={!isEditing}
                        className="add-skill-btn"
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                    <div className="skills-list">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          {isEditing && (
                            <button onClick={() => removeSkill(skill)}>
                              <i className="ri-close-line"></i>
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label><i className="ri-briefcase-line"></i> Experience</label>
                  <textarea
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Describe your work experience..."
                  />
                </div>
                <div className="form-group full-width">
                  <label><i className="ri-graduation-cap-line"></i> Education</label>
                  <textarea
                    name="education"
                    value={profile.education}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Describe your educational background..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="tab-content social-links">
              <div className="form-grid">
                <div className="form-group">
                  <label><i className="ri-linkedin-line"></i> LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-github-line"></i> GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><i className="ri-global-line"></i> Portfolio</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="tab-content resume-info">
              <div className="resume-section">
                <div className="resume-header">
                  <h3><i className="ri-file-text-line"></i> Resume Management</h3>
                  <p>Upload and manage your resume for job applications</p>
                </div>
                
                {resumeInfo?.hasResume ? (
                  <div className="resume-card">
                    <div className="resume-details">
                      <div className="resume-icon">
                        <i className="ri-file-text-line"></i>
                      </div>
                      <div className="resume-info-text">
                        <h4>{resumeInfo.fileName}</h4>
                        <p>Uploaded on {new Date(resumeInfo.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="resume-actions">
                      <button 
                        className="manage-resume-btn"
                        onClick={() => setShowResumeManager(true)}
                      >
                        <i className="ri-settings-line"></i> Manage Resume
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-resume-card">
                    <div className="no-resume-icon">
                      <i className="ri-file-add-line"></i>
                    </div>
                    <h4>No Resume Uploaded</h4>
                    <p>Upload your resume to apply for jobs and showcase your skills</p>
                    <button 
                      className="upload-resume-btn"
                      onClick={() => setShowResumeManager(true)}
                    >
                      <i className="ri-upload-line"></i> Upload Resume
                    </button>
                  </div>
                )}
                
                <div className="resume-tips">
                  <h4><i className="ri-lightbulb-line"></i> Resume Tips</h4>
                  <ul>
                    <li>Keep your resume updated with latest experience</li>
                    <li>Use PDF format for better compatibility</li>
                    <li>Ensure file size is under 5MB</li>
                    <li>Include relevant keywords for your industry</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Resume Manager Modal */}
      {showResumeManager && (
        <ResumeManager 
          onClose={() => {
            setShowResumeManager(false);
            fetchResumeInfo(); // Refresh resume info after closing
          }} 
        />
      )}
    </div>
  );
}

export default Profile;