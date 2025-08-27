import React, { useState, useEffect } from 'react';
import WebinarSearch from './WebinarSearch';
import WebinarFilters from './WebinarFilters';
import WebinarCard from './WebinarCard';
import WebinarModal from './WebinarModal';
import { sampleWebinars } from './webinarData';
import './WebinarListing.css';

function WebinarListing() {
  const [webinars, setWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    mode: '',
    price: '',
    date: '',
    sortBy: 'date'
  });

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars`);
      if (response.ok) {
        const data = await response.json();
        setWebinars(data);
        setFilteredWebinars(data);
      } else {
        setWebinars(sampleWebinars);
        setFilteredWebinars(sampleWebinars);
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
      setWebinars(sampleWebinars);
      setFilteredWebinars(sampleWebinars);
    }
  };

  useEffect(() => {
    let filtered = [...webinars];

    if (searchTerm) {
      filtered = filtered.filter(webinar =>
        webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(webinar => webinar.category === filters.category);
    }

    if (filters.mode) {
      filtered = filtered.filter(webinar => webinar.mode === filters.mode);
    }

    if (filters.price) {
      if (filters.price === 'free') {
        filtered = filtered.filter(webinar => webinar.price === 'Free');
      } else if (filters.price === 'paid') {
        filtered = filtered.filter(webinar => webinar.price !== 'Free');
      }
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price === 'Free' ? -1 : 1;
        default:
          return 0;
      }
    });

    setFilteredWebinars(filtered);
  }, [webinars, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleWebinarClick = (webinar) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWebinar(null);
  };

  return (
    <div className="webinar-listing-container">
      <WebinarSearch onSearch={handleSearch} />
      
      <div className="webinar-content">
        <button 
          className="filter-toggle" 
          onClick={() => setIsFilterOpen(true)}
        >
          <i className="ri-filter-line"></i> Filters
        </button>
        
        <div className={`filter-overlay ${isFilterOpen ? 'show' : ''}`} 
             onClick={() => setIsFilterOpen(false)}></div>
        
        <div className={`filters-section ${isFilterOpen ? 'open' : ''}`}>
          <WebinarFilters 
            onFilterChange={handleFilterChange} 
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
        
        <div className="webinars-section">
          <div className="webinars-header">
            <h2>{filteredWebinars.length} Webinars Found</h2>
            <p>Discover amazing learning opportunities</p>
          </div>
          
          <div className="webinars-list">
            {filteredWebinars.length > 0 ? (
              filteredWebinars.map((webinar, index) => (
                <div key={webinar.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <WebinarCard webinar={webinar} onClick={handleWebinarClick} />
                </div>
              ))
            ) : (
              <div className="no-webinars">
                <i className="ri-search-line"></i>
                <h3>No webinars found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <WebinarModal 
        webinar={selectedWebinar} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default WebinarListing;