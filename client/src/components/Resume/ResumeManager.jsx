import React, { useState, useEffect } from 'react';
import './ResumeManager.css';

const ResumeManager = ({ onClose }) => {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResumeInfo(data);
      }
    } catch (error) {
      console.error('Error fetching resume info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, DOC, or DOCX file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert('Resume uploaded successfully!');
        setSelectedFile(null);
        fetchResumeInfo();
        // Reset file input
        document.getElementById('resume-file-input').value = '';
      } else {
        const error = await response.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resumeInfo.fileName || 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Download failed');
      }
    } catch (error) {
      alert('Download failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Resume deleted successfully!');
        fetchResumeInfo();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      alert('Delete failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="resume-manager-overlay">
        <div className="resume-manager-modal">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-manager-overlay" onClick={onClose}>
      <div className="resume-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="resume-manager-header">
          <h2>Resume Management</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="resume-manager-content">
          {resumeInfo?.hasResume ? (
            <div className="resume-exists">
              <div className="resume-info">
                <div className="resume-icon">
                  <i className="ri-file-text-line"></i>
                </div>
                <div className="resume-details">
                  <h3>{resumeInfo.fileName}</h3>
                  <p>Uploaded on {new Date(resumeInfo.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="resume-actions">
                <button className="download-btn" onClick={handleDownload}>
                  <i className="ri-download-line"></i>
                  Download
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  <i className="ri-delete-bin-line"></i>
                  Delete
                </button>
              </div>

              <div className="upload-new-section">
                <h4>Upload New Resume</h4>
                <p>This will replace your current resume</p>
                <div className="file-upload-section">
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <label htmlFor="resume-file-input" className="file-input-label">
                    <i className="ri-upload-line"></i>
                    Choose File
                  </label>
                  {selectedFile && (
                    <div className="selected-file">
                      <span>{selectedFile.name}</span>
                      <button 
                        className="upload-btn" 
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-resume">
              <div className="no-resume-icon">
                <i className="ri-file-add-line"></i>
              </div>
              <h3>No Resume Uploaded</h3>
              <p>Upload your resume to get started with job applications</p>
              
              <div className="file-upload-section">
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <label htmlFor="resume-file-input" className="file-input-label">
                  <i className="ri-upload-line"></i>
                  Choose Resume File
                </label>
                {selectedFile && (
                  <div className="selected-file">
                    <span>{selectedFile.name}</span>
                    <button 
                      className="upload-btn" 
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="file-requirements">
                <h4>File Requirements:</h4>
                <ul>
                  <li>Supported formats: PDF, DOC, DOCX</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Ensure your resume is up-to-date</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;