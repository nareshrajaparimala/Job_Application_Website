import React, { useState, useEffect } from 'react';
import './ContentManager.css';

function ContentManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchItems();
  }, [type, currentPage]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/${type}?page=${currentPage}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
        alert(`${type.slice(0, -1)} deleted successfully!`);
      }
    } catch (error) {
      alert(`Error deleting ${type.slice(0, -1)}`);
    }
  };

  const bulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} selected items?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type, ids: selectedItems })
      });
      
      if (response.ok) {
        setItems(items.filter(item => !selectedItems.includes(item._id)));
        setSelectedItems([]);
        alert('Items deleted successfully!');
      }
    } catch (error) {
      alert('Error deleting items');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(items.map(item => item._id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (loading) {
    return <div className="loading">Loading {type}...</div>;
  }

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Management</h2>
        <div className="bulk-actions">
          {selectedItems.length > 0 && (
            <>
              <span>{selectedItems.length} selected</span>
              <button onClick={bulkDelete} className="bulk-delete-btn">
                <i className="ri-delete-bin-line"></i> Delete Selected
              </button>
              <button onClick={clearSelection} className="clear-btn">Clear</button>
            </>
          )}
          <button onClick={selectAll} className="select-all-btn">Select All</button>
        </div>
      </div>

      <div className="items-grid">
        {items.map(item => (
          <div key={item._id} className={`item-card ${selectedItems.includes(item._id) ? 'selected' : ''}`}>
            <div className="item-header">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => toggleSelectItem(item._id)}
              />
              <button 
                className="delete-item-btn"
                onClick={() => deleteItem(item._id)}
                title="Delete"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
            
            <div className="item-content">
              <h3>{item.title}</h3>
              <p className="company">{item.company || item.speaker || item.organization}</p>
              <p className="location">{item.location}</p>
              
              {type === 'jobs' && (
                <div className="job-details">
                  <span className="salary">{item.salary}</span>
                  <span className={`category ${item.category}`}>{item.category}</span>
                </div>
              )}
              
              {type === 'internships' && (
                <div className="internship-details">
                  <span className="duration">{item.duration}</span>
                  <span className="stipend">{item.stipend}</span>
                </div>
              )}
              
              {type === 'webinars' && (
                <div className="webinar-details">
                  <span className="date">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="price">{item.price}</span>
                </div>
              )}
              
              <div className="item-meta">
                <span className="created-date">
                  {new Date(item.createdAt || item.datePosted).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ContentManager;