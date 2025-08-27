import React, { useState } from 'react';

function WebinarSearch({ onSearch }) {
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
        <h1>Discover Amazing Webinars</h1>
        <p>Learn from industry experts and expand your knowledge</p>
      </div>
      
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <i className="ri-search-line search-icon"></i>
          <input
            type="text"
            placeholder="Search webinars by title, speaker, or category..."
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
      </form>
    </div>
  );
}

export default WebinarSearch;