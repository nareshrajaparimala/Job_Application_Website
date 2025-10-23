import React, { useState } from 'react';
import './AddContentForm.css';

function AddContentForm({ type, onClose, onSuccess }) {
  const [formData, setFormData] = useState(getInitialData(type));

  function getInitialData(contentType) {
    switch (contentType) {
      case 'job':
        return {
          title: '', company: '', companyLogo: '', location: '', salary: '', jobType: 'Full-time',
          workMode: 'Remote', category: 'private', shortDescription: '',
          description: 'Default description', requirements: '', skills: '', deadline: '', applicationLink: ''
        };
      case 'webinar':
        return {
          title: '', speaker: '', organization: '', date: '', time: '',
          mode: 'Online', platform: '', price: 'Free', category: 'Technology',
          shortDescription: '', description: 'Default description'
        };
      case 'internship':
        return {
          title: '', company: '', location: '', duration: '', stipend: '',
          workMode: 'Remote', type: 'Full-time', shortDescription: '',
          description: 'Default description', requirements: '', skills: '', applicationLink: ''
        };
      case 'college':
        return {
          name: '', rating: '', courses: '', details: 'Default details', overview: 'Default overview'
        };
      default:
        return {};
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const processedData = { ...formData };
      
      if (processedData.requirements) {
        processedData.requirements = processedData.requirements.split(',').map(item => item.trim());
      }
      if (processedData.skills) {
        processedData.skills = processedData.skills.split(',').map(item => item.trim());
      }

      const endpoint = type === 'college' ? 'colleges' : `${type}s`;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();
      if (result.success) {
        alert(`${type} added successfully!`);
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Failed to add content');
      }
    } catch (error) {
      alert('Error adding content');
    }
  };

  const renderJobFields = () => (
    <>
      <input placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <input placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
      <div className="logo-upload-section">
        <label>Company Logo (Optional)</label>
        <input 
          type="url" 
          placeholder="Company Logo URL (e.g., https://example.com/logo.png)" 
          value={formData.companyLogo || ''} 
          onChange={(e) => setFormData({...formData, companyLogo: e.target.value})} 
        />
        {formData.companyLogo && (
          <div className="logo-preview">
            <img src={formData.companyLogo} alt="Logo preview" onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>
      <input placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
      <input placeholder="Salary" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} required />
      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
        <option value="private">Private</option>
        <option value="government">Government</option>
      </select>
      <textarea placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}  />
      <textarea placeholder="Full Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}  />
      <textarea placeholder="Requirements (comma separated)" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
      <textarea placeholder="Skills (comma separated)" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
      <input placeholder="Application Link (URL)" value={formData.applicationLink} onChange={(e) => setFormData({...formData, applicationLink: e.target.value})} />
      <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} required />
    </>
  );

  const renderWebinarFields = () => (
    <>
      <input placeholder="Webinar Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <input placeholder="Speaker Name" value={formData.speaker} onChange={(e) => setFormData({...formData, speaker: e.target.value})} required />
      <input placeholder="Organization" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} required />
      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
      <input placeholder="Time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
      <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})}>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
      </select>
      <input placeholder="Platform/Venue" value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} required />
      <input placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
      <textarea placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} required />
      <textarea placeholder="Full Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
    </>
  );

  const renderInternshipFields = () => (
    <>
      <input placeholder="Internship Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      <input placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
      <input placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
      <input placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
      <input placeholder="Stipend" value={formData.stipend} onChange={(e) => setFormData({...formData, stipend: e.target.value})} required />
      <select value={formData.workMode} onChange={(e) => setFormData({...formData, workMode: e.target.value})}>
        <option value="Remote">Remote</option>
        <option value="On-site">On-site</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      <textarea placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} required />
      <textarea placeholder="Full Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
      <textarea placeholder="Requirements (comma separated)" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
      <textarea placeholder="Skills (comma separated)" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
      <input placeholder="Application Link (URL)" value={formData.applicationLink} onChange={(e) => setFormData({...formData, applicationLink: e.target.value})} />
    </>
  );

  const renderCollegeFields = () => (
    <>
      <input placeholder="College Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
      <input placeholder="Rating" type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} required />
      <textarea placeholder="Courses (comma separated)" value={formData.courses} onChange={(e) => setFormData({...formData, courses: e.target.value})} required />
      <textarea placeholder="Details" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} required />
      <textarea placeholder="Overview" value={formData.overview} onChange={(e) => setFormData({...formData, overview: e.target.value})} required />
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="add-content-form">
          {type === 'job' && renderJobFields()}
          {type === 'webinar' && renderWebinarFields()}
          {type === 'internship' && renderInternshipFields()}
          {type === 'college' && renderCollegeFields()}
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add {type.charAt(0).toUpperCase() + type.slice(1)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContentForm;