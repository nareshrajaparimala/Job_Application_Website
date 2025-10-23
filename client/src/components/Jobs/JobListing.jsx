import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobSearch from './JobSearch';
import JobFilters from './JobFilters';
import JobCard from './JobCard';
import JobModal from './JobModal';
import { sampleJobs } from './jobData';
import './JobListing.css';
import '../AdminDeleteButton.css';

const isAdmin = () => {
  const user = localStorage.getItem('user');
  return user && JSON.parse(user).role === 'admin';
};

function JobListing({ jobType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    salary: '',
    jobType: '',
    workMode: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  useEffect(() => {
    if (id && jobs.length > 0) {
      const job = jobs.find(j => (j.id || j._id) == id);
      if (job) {
        setSelectedJob(job);
        setIsModalOpen(true);
      } else {
        // If job not found in local data, try to fetch it from API
        fetchJobById(id);
      }
    }
  }, [id, jobs]);

  const fetchJobById = async (jobId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/jobs/${jobId}`);
      if (response.ok) {
        const job = await response.json();
        setSelectedJob(job);
        setIsModalOpen(true);
      } else {
        // If API fails, show error message
        if (window.showPopup) {
          window.showPopup('Job not found', 'error');
        }
        navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
      }
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      if (window.showPopup) {
        window.showPopup('Job not found', 'error');
      }
      navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
    }
  };

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.detail.type === 'job') {
        fetchJobs();
      }
    };
    
    window.addEventListener('refreshContent', handleRefresh);
    return () => window.removeEventListener('refreshContent', handleRefresh);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/jobs?category=${jobType}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          setFilteredJobs(data);
        } else {
          // If no data from API, use sample data but filter out deleted ones
          const deletedIds = JSON.parse(localStorage.getItem('deletedJobIds') || '[]');
          const jobData = (sampleJobs[jobType] || []).filter(job => 
            !deletedIds.includes(job.id) && !deletedIds.includes(job._id)
          );
          setJobs(jobData);
          setFilteredJobs(jobData);
        }
      } else {
        const deletedIds = JSON.parse(localStorage.getItem('deletedJobIds') || '[]');
        const jobData = (sampleJobs[jobType] || []).filter(job => 
          !deletedIds.includes(job.id) && !deletedIds.includes(job._id)
        );
        setJobs(jobData);
        setFilteredJobs(jobData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const deletedIds = JSON.parse(localStorage.getItem('deletedJobIds') || '[]');
      const jobData = (sampleJobs[jobType] || []).filter(job => 
        !deletedIds.includes(job.id) && !deletedIds.includes(job._id)
      );
      setJobs(jobData);
      setFilteredJobs(jobData);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let filtered = [...jobs];

    // Search filter
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(job =>
        (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (filters.state && filters.state.trim()) {
      filtered = filtered.filter(job =>
        (job.location || '').toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // City filter
    if (filters.city && filters.city.trim()) {
      filtered = filtered.filter(job =>
        (job.location || '').toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Salary filter
    if (filters.salary && filters.salary.trim()) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const jobSalary = job.salary.split('-').map(s => parseInt(s.replace(/[^\d]/g, '') || '0'));
        const filterRange = filters.salary.split('-').map(s => parseInt(s.replace(/[^\d]/g, '') || '0'));
        
        if (filters.salary.includes('+')) {
          return jobSalary[0] >= filterRange[0];
        }
        
        return jobSalary[0] >= filterRange[0] && (jobSalary[1] || jobSalary[0]) <= filterRange[1];
      });
    }

    // Job type filter
    if (filters.jobType && filters.jobType.trim()) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Work mode filter
    if (filters.workMode && filters.workMode.trim()) {
      filtered = filtered.filter(job => job.workMode === filters.workMode);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt || b.datePosted || 0) - new Date(a.createdAt || a.datePosted || 0);
        case 'oldest':
          return new Date(a.createdAt || a.datePosted || 0) - new Date(b.createdAt || b.datePosted || 0);
        case 'salary-high':
          const aSalaryHigh = parseInt((a.salary || '0').split('-')[1] || (a.salary || '0').split('-')[0]);
          const bSalaryHigh = parseInt((b.salary || '0').split('-')[1] || (b.salary || '0').split('-')[0]);
          return bSalaryHigh - aSalaryHigh;
        case 'salary-low':
          const aSalaryLow = parseInt((a.salary || '0').split('-')[0]);
          const bSalaryLow = parseInt((b.salary || '0').split('-')[0]);
          return aSalaryLow - bSalaryLow;
        case 'deadline':
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    if (id) {
      navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
    }
  };

  const handleDeleteJob = async (jobId) => {
    window.showConfirm('Are you sure you want to delete this job?', async () => {
    
    // Store deleted ID in localStorage for permanent deletion of sample data
    const deletedIds = JSON.parse(localStorage.getItem('deletedJobIds') || '[]');
    if (!deletedIds.includes(jobId)) {
      deletedIds.push(jobId);
      localStorage.setItem('deletedJobIds', JSON.stringify(deletedIds));
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from current state regardless of API response
      setJobs(jobs.filter(job => job._id !== jobId && job.id !== jobId));
      setFilteredJobs(filteredJobs.filter(job => job._id !== jobId && job.id !== jobId));
      window.showNotification('Job deleted permanently!', 'success');
    } catch (error) {
      // Remove from current state even if API fails
      setJobs(jobs.filter(job => job._id !== jobId && job.id !== jobId));
      setFilteredJobs(filteredJobs.filter(job => job._id !== jobId && job.id !== jobId));
      window.showNotification('Job deleted permanently!', 'success');
    }
    });
  };

  return (
    <div className="job-listing-container">
      <JobSearch onSearch={handleSearch} jobType={jobType} />
      
      <div className="job-content">
        <div className="filters-section">
          <JobFilters onFilterChange={handleFilterChange} jobType={jobType} />
        </div>
        
        <div className="jobs-section">
          <div className="jobs-header">
            <h2>
              {filteredJobs.length} {jobType === 'government' ? 'Government' : 'Private'} Jobs Found
            </h2>
            <p>Showing latest job opportunities</p>
          </div>
          
          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <div key={job._id || job.id} style={{ animationDelay: `${index * 0.1}s` }} className="job-item">
                  <JobCard job={job} onClick={handleJobClick} />
                  {isAdmin() && (
                    <button 
                      className="admin-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id || job.id);
                      }}
                      title="Delete Job"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <i className="ri-search-line"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <JobModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default JobListing;