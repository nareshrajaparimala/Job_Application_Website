import React, { useState } from 'react';

function InternshipSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-section">
      <div className="search-header">
        <h1>Find Your Perfect Internship</h1>
        <p>Discover internship opportunities that match your skills and interests</p>
      </div>
      
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <i className="ri-search-line search-icon"></i>
          <input
            type="text"
            placeholder="Search internships by title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button type="button" onClick={handleClear} className="clear-btn">
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          <i className="ri-search-line"></i>
          Search
        </button>
      </form>
    </div>
  );
}

export default InternshipSearch;