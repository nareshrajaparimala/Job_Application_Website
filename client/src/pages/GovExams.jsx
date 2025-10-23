import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../components/ShareModal/ShareModal';
import './GovExams.css';

function GovExams() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    postName: '',
    startDate: '',
    endDate: '',
    examDate: '',
    admitCardDate: '',
    resultDate: '',
    applicationFee: '',
    ageLimit: '',
    totalPosts: '',
    eligibility: '',
    applyLink: '',
    selectionMode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sample data
  const sampleExams = [
    {
      id: 1,
      postName: "SSC Delhi Police Head Constable (Staff Selection Commission)",
      startDate: "2025-09-29",
      endDate: "2025-10-20",
      examDate: "December 2025 - January 2026",
      admitCardDate: "Before Exam",
      resultDate: "To be updated",
      applicationFee: "*General,OBC,EWS -₹100 *SC,ST,PWD-₹00",
      ageLimit: "18-25",
      totalPosts: "509",
      eligibility: "*Candidates must have passed 10+2 (Senior Secondary) or equivalent examination from a recognized board. *Must possess a typing speed of 30 words per minute in English OR 25 words per minute in Hindi on computer.",
      applyLink: "https://ssc.gov.in/",
      selectionMode: "CBT, PE & MT, Trade Test, Document Verification, Medical Examination"
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
    fetchExams();
  }, []);

  useEffect(() => {
    if (id && exams.length > 0) {
      const exam = exams.find(e => e.id == id || e._id === id);
      if (exam) {
        setSelectedExam(exam);
        setShowModal(true);
      } else {
        // If exam not found in local data, try to fetch it from API
        fetchExamById(id);
      }
    }
  }, [id, exams]);

  const fetchExamById = async (examId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/detail/${examId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSelectedExam(result.exam);
          setShowModal(true);
        } else {
          throw new Error('Exam not found');
        }
      } else {
        throw new Error('Exam not found');
      }
    } catch (error) {
      console.error('Error fetching exam by ID:', error);
      if (window.showPopup) {
        window.showPopup('Government exam not found', 'error');
      }
      navigate('/gov-exams');
    }
  };
  
  const fetchExams = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/all`);
      const data = await response.json();
      if (data.success) {
        const allExams = [...data.exams, ...sampleExams];
        setExams(allExams);
        setFilteredExams(allExams);
      } else {
        setExams(sampleExams);
        setFilteredExams(sampleExams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams(sampleExams);
      setFilteredExams(sampleExams);
    }
  };

  useEffect(() => {
    const filtered = exams.filter(exam => 
      exam.postName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.ageLimit.includes(searchTerm) ||
      exam.totalPosts.includes(searchTerm)
    );
    setFilteredExams(filtered);
  }, [searchTerm, exams]);

  const handleRowClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleDelete = async (examId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/delete/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setExams(exams.filter(exam => exam.id !== examId));
        if (window.showPopup) {
          window.showPopup('Exam deleted successfully!', 'success');
        }
      } else {
        throw new Error('Failed to delete exam');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to delete exam', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newExam = await response.json();
        setExams(prev => [newExam.exam, ...prev]);
        setFormData({
          postName: '',
          startDate: '',
          endDate: '',
          examDate: '',
          admitCardDate: '',
          resultDate: '',
          applicationFee: '',
          ageLimit: '',
          totalPosts: '',
          eligibility: '',
          applyLink: '',
          selectionMode: ''
        });
        setShowAddForm(false);
        fetchExams(); // Refresh the exams list
        if (window.showPopup) {
          window.showPopup('Exam added successfully!', 'success');
        }
      } else {
        throw new Error('Failed to add exam');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to add exam', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpApply = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      if (window.showPopup) {
        window.showPopup('Please login to get help', 'warning');
      }
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/gov-exams/help-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          examDetails: selectedExam,
          userDetails: user
        })
      });

      const result = await response.json();

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup('Help request sent successfully!', 'success');
        }
        setShowModal(false);
        // Trigger dashboard update
        window.dispatchEvent(new CustomEvent('govExamApplicationUpdate'));
      } else if (response.status === 409) {
        if (window.showPopup) {
          window.showPopup('You have already applied for this exam!', 'warning');
        }
      } else {
        throw new Error(result.message || 'Failed to send help request');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Failed to send help request', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="gov-exams-page">
      <div className="page-header">
        <h1>Government Exams & Jobs</h1>
        <p>Latest government job notifications and exam updates</p>
        
        <div className="search-section">
          <div className="search-container">
            <i className="ri-search-line search-icon"></i>
            <input
              type="text"
              placeholder="Search exams, dates, posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
        </div>
        
        {isAdmin && (
          <button className="add-exam-btn" onClick={() => setShowAddForm(true)}>
            <i className="ri-add-line"></i> Add New Exam
          </button>
        )}
      </div>

      <div className="exams-table-container">
        <div className="table-wrapper">
          <table className="exams-table">
            <thead>
              <tr>
                <th>Post Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Exam Date</th>
                <th>Application Fee</th>
                <th>Age Limit</th>
                <th>Total Posts</th>
                <th>Apply Link</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="exam-row" onClick={() => handleRowClick(exam)}>
                  <td 
                    className="post-name"
                    dangerouslySetInnerHTML={{ __html: highlightText(exam.postName, searchTerm) }}
                  ></td>
                  <td>{new Date(exam.startDate).toLocaleDateString()}</td>
                  <td>{new Date(exam.endDate).toLocaleDateString()}</td>
                  <td>{exam.examDate}</td>
                  <td className="fee-cell">{exam.applicationFee}</td>
                  <td>{exam.ageLimit}</td>
                  <td>{exam.totalPosts}</td>
                  <td>
                    <button 
                      className="apply-link-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(exam.applyLink, '_blank');
                      }}
                    >
                      <i className="ri-external-link-line"></i>
                    </button>
                  </td>
                  {isAdmin && (
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={(e) => handleDelete(exam.id, e)}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="add-exam-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="ri-add-line"></i> Add New Government Exam</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            
            <form className="add-exam-form" onSubmit={handleAddExam}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="postName">Post Name *</label>
                  <input
                    type="text"
                    id="postName"
                    name="postName"
                    value={formData.postName}
                    onChange={handleInputChange}
                    placeholder="e.g., SSC Delhi Police Head Constable"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Application Start Date *</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Application End Date *</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="examDate">Exam Date *</label>
                  <input
                    type="text"
                    id="examDate"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    placeholder="e.g., December 2025 - January 2026"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admitCardDate">Admit Card Date</label>
                  <input
                    type="text"
                    id="admitCardDate"
                    name="admitCardDate"
                    value={formData.admitCardDate}
                    onChange={handleInputChange}
                    placeholder="e.g., Before Exam"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="resultDate">Result Date</label>
                  <input
                    type="text"
                    id="resultDate"
                    name="resultDate"
                    value={formData.resultDate}
                    onChange={handleInputChange}
                    placeholder="e.g., To be updated"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ageLimit">Age Limit *</label>
                  <input
                    type="text"
                    id="ageLimit"
                    name="ageLimit"
                    value={formData.ageLimit}
                    onChange={handleInputChange}
                    placeholder="e.g., 18-25"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="totalPosts">Total Posts *</label>
                  <input
                    type="text"
                    id="totalPosts"
                    name="totalPosts"
                    value={formData.totalPosts}
                    onChange={handleInputChange}
                    placeholder="e.g., 509"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="applicationFee">Application Fee *</label>
                  <input
                    type="text"
                    id="applicationFee"
                    name="applicationFee"
                    value={formData.applicationFee}
                    onChange={handleInputChange}
                    placeholder="e.g., *General,OBC,EWS -₹100 *SC,ST,PWD-₹00"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="applyLink">Official Apply Link *</label>
                  <input
                    type="url"
                    id="applyLink"
                    name="applyLink"
                    value={formData.applyLink}
                    onChange={handleInputChange}
                    placeholder="https://example.gov.in"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="eligibility">Eligibility Criteria *</label>
                  <textarea
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    placeholder="Enter detailed eligibility criteria..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="selectionMode">Selection Process *</label>
                  <textarea
                    id="selectionMode"
                    name="selectionMode"
                    value={formData.selectionMode}
                    onChange={handleInputChange}
                    placeholder="e.g., CBT, PE & MT, Trade Test, Document Verification, Medical Examination"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line spinning"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="ri-add-line"></i>
                      Add Exam
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exam Details Modal */}
      {showModal && selectedExam && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          if (id) navigate('/gov-exams');
        }}>
          <div className="exam-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedExam.postName}</h2>
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                if (id) navigate('/gov-exams');
              }}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="exam-details-grid">
                <div className="detail-card">
                  <h3>Important Dates</h3>
                  <div className="date-info">
                    <p><strong>Application Start:</strong> {new Date(selectedExam.startDate).toLocaleDateString()}</p>
                    <p><strong>Application End:</strong> {new Date(selectedExam.endDate).toLocaleDateString()}</p>
                    <p><strong>Exam Date:</strong> {selectedExam.examDate}</p>
                    <p><strong>Admit Card:</strong> {selectedExam.admitCardDate}</p>
                    <p><strong>Result:</strong> {selectedExam.resultDate}</p>
                  </div>
                </div>

                <div className="detail-card">
                  <h3>Application Details</h3>
                  <p><strong>Application Fee:</strong> {selectedExam.applicationFee}</p>
                  <p><strong>Age Limit:</strong> {selectedExam.ageLimit} years</p>
                  <p><strong>Total Posts:</strong> {selectedExam.totalPosts}</p>
                </div>

                <div className="detail-card full-width">
                  <h3>Eligibility Criteria</h3>
                  <p>{selectedExam.eligibility}</p>
                </div>

                <div className="detail-card full-width">
                  <h3>Selection Process</h3>
                  <p>{selectedExam.selectionMode}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="share-btn"
                  onClick={() => setShowShareModal(true)}
                >
                  <i className="ri-share-line"></i>
                  Share
                </button>
                <button 
                  className="official-link-btn"
                  onClick={() => window.open(selectedExam.applyLink, '_blank')}
                >
                  <i className="ri-external-link-line"></i>
                  Visit Official Website
                </button>
                <button 
                  className="help-apply-btn"
                  onClick={handleHelpApply}
                  disabled={isLoading}
                >
                  <i className={isLoading ? "ri-loader-4-line" : "ri-customer-service-line"}></i>
                  {isLoading ? 'Sending...' : 'Get Help to Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${window.location.origin}/gov-exams/${selectedExam?.id}`}
        title={selectedExam?.postName}
        type="Government Exam"
      />
    </div>
  );
}

export default GovExams;