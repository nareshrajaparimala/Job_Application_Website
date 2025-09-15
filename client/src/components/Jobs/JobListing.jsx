import React, { useState, useEffect } from 'react';
import JobSearch from './JobSearch';
import JobFilters from './JobFilters';
import JobCard from './JobCard';
import JobModal from './JobModal';
import { sampleJobs } from './jobData';
import './JobListing.css';

function JobListing({ jobType }) {
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

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs for type:', jobType);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admin/jobs`);
      if (response.ok) {
        const data = await response.json();
        console.log('All jobs from API:', data);
        const filteredData = data.filter(job => job.category === jobType);
        console.log('Filtered jobs:', filteredData);
        setJobs(filteredData);
        setFilteredJobs(filteredData);
      } else {
        console.log('API failed, using sample data');
        const jobData = sampleJobs[jobType] || [];
        setJobs(jobData);
        setFilteredJobs(jobData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const jobData = sampleJobs[jobType] || [];
      setJobs(jobData);
      setFilteredJobs(jobData);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Salary filter
    if (filters.salary) {
      filtered = filtered.filter(job => {
        const jobSalary = job.salary.split('-').map(s => parseInt(s.replace(/[^\d]/g, '')));
        const filterRange = filters.salary.split('-').map(s => parseInt(s.replace(/[^\d]/g, '')));
        
        if (filters.salary.includes('+')) {
          return jobSalary[0] >= filterRange[0];
        }
        
        return jobSalary[0] >= filterRange[0] && jobSalary[1] <= filterRange[1];
      });
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Work mode filter
    if (filters.workMode) {
      filtered = filtered.filter(job => job.workMode === filters.workMode);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.datePosted) - new Date(a.datePosted);
        case 'oldest':
          return new Date(a.datePosted) - new Date(b.datePosted);
        case 'salary-high':
          const aSalaryHigh = parseInt(a.salary.split('-')[1] || a.salary.split('-')[0]);
          const bSalaryHigh = parseInt(b.salary.split('-')[1] || b.salary.split('-')[0]);
          return bSalaryHigh - aSalaryHigh;
        case 'salary-low':
          const aSalaryLow = parseInt(a.salary.split('-')[0]);
          const bSalaryLow = parseInt(b.salary.split('-')[0]);
          return aSalaryLow - bSalaryLow;
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
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
                <div key={job.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <JobCard job={job} onClick={handleJobClick} />
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