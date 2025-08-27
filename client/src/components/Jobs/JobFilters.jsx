import React, { useState } from 'react';
import './JobFilters.css';

function JobFilters({ onFilterChange, jobType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    salary: '',
    jobType: '',
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
      salary: '',
      jobType: '',
      workMode: '',
      sortBy: 'latest'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const jobTypes = jobType === 'government' 
    ? ['Full Time', 'Contract', 'Temporary']
    : ['Full Time', 'Part Time', 'Internship', 'Contract', 'Freelance'];

  const workModes = ['Remote', 'On-site', 'Hybrid'];

  return (
    <div className="job-filters">
      <button className="mobile-filter-toggle" onClick={() => setIsOpen(!isOpen)}>
        <i className="ri-filter-line"></i>
        Filters
      </button>
      
      <div className={`filters-content ${isOpen ? 'open' : ''}`}>
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        </div>

      <div className="filter-group">
        <label>State</label>
        <select 
          value={filters.state} 
          onChange={(e) => handleFilterChange('state', e.target.value)}
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>City</label>
        <input
          type="text"
          placeholder="Enter city"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Salary Range</label>
        <select 
          value={filters.salary} 
          onChange={(e) => handleFilterChange('salary', e.target.value)}
        >
          <option value="">Any Salary</option>
          <option value="0-25000">₹0 - ₹25,000</option>
          <option value="25000-50000">₹25,000 - ₹50,000</option>
          <option value="50000-100000">₹50,000 - ₹1,00,000</option>
          <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
          <option value="200000+">₹2,00,000+</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select 
          value={filters.jobType} 
          onChange={(e) => handleFilterChange('jobType', e.target.value)}
        >
          <option value="">All Types</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Work Mode</label>
        <select 
          value={filters.workMode} 
          onChange={(e) => handleFilterChange('workMode', e.target.value)}
        >
          <option value="">All Modes</option>
          {workModes.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select 
          value={filters.sortBy} 
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary-high">Salary: High to Low</option>
          <option value="salary-low">Salary: Low to High</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>
      </div>
    </div>
  );
}

export default JobFilters;