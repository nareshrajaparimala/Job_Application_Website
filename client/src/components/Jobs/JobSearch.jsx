import React, { useState } from 'react';
import './JobSearch.css';

function JobSearch({ onSearch, jobType }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="job-search-container">
      <div className="search-header">
        <h1>{jobType === 'government' ? 'Government Jobs' : 'Private Jobs'}</h1>
        <p>Find your dream job with us</p>
      </div>
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-container">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-job"
          />
          <button type="submit" className="search-btn">
            
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobSearch;