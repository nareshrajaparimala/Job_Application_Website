import React, { useState } from 'react';

function WebinarFilters({ onFilterChange, onClose }) {
  const [filters, setFilters] = useState({
    category: '',
    mode: '',
    price: '',
    date: '',
    sortBy: 'date'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      mode: '',
      price: '',
      date: '',
      sortBy: 'date'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filters</h3>
        <div>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All
          </button>
          {onClose && (
            <button onClick={onClose} className="close-filters-btn">
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Marketing">Marketing</option>
          <option value="Business">Business</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Mode</label>
        <select value={filters.mode} onChange={(e) => handleFilterChange('mode', e.target.value)}>
          <option value="">All Modes</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price</label>
        <select value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)}>
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
      </div>
    </div>
  );
}

export default WebinarFilters;