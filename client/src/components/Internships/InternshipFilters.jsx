import React, { useState } from 'react';

function InternshipFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    stipend: '',
    duration: '',
    workMode: '',
    sortBy: 'latest'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      state: '',
      city: '',
      stipend: '',
      duration: '',
      workMode: '',
      sortBy: 'latest'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <label>State</label>
        <select value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}>
          <option value="">All States</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Telangana">Telangana</option>
          <option value="Delhi">Delhi</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>
      </div>

      <div className="filter-group">
        <label>City</label>
        <select value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)}>
          <option value="">All Cities</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Minimum Stipend</label>
        <select value={filters.stipend} onChange={(e) => handleFilterChange('stipend', e.target.value)}>
          <option value="">Any Stipend</option>
          <option value="5000">₹5,000+</option>
          <option value="10000">₹10,000+</option>
          <option value="15000">₹15,000+</option>
          <option value="20000">₹20,000+</option>
          <option value="25000">₹25,000+</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Duration</label>
        <select value={filters.duration} onChange={(e) => handleFilterChange('duration', e.target.value)}>
          <option value="">Any Duration</option>
          <option value="1 month">1 month</option>
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="6 months">6 months</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Work Mode</label>
        <select value={filters.workMode} onChange={(e) => handleFilterChange('workMode', e.target.value)}>
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
          <option value="latest">Latest Posted</option>
          <option value="oldest">Oldest Posted</option>
          <option value="stipend-high">Highest Stipend</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>
    </div>
  );
}

export default InternshipFilters;