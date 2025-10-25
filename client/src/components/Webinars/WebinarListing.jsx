import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebinarSearch from './WebinarSearch';
import WebinarFilters from './WebinarFilters';
import WebinarCard from './WebinarCard';
import WebinarModal from './WebinarModal';
import { sampleWebinars } from './webinarData';
import './WebinarListing.css';
import '../AdminDeleteButton.css';

const isAdmin = () => {
  const user = localStorage.getItem('user');
  return user && JSON.parse(user).role === 'admin';
};

function WebinarListing() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (id && webinars.length > 0) {
      const webinar = webinars.find(w => (w.webinarId || w._id) == id);
      if (webinar) {
        setSelectedWebinar(webinar);
        setIsModalOpen(true);
      } else {
        fetchWebinarById(id);
      }
    }
  }, [id, webinars]);

  const fetchWebinarById = async (webinarId) => {
    try {
      // First try to fetch by share ID
      let response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/webinars/share/${webinarId}`);
      
      if (!response.ok) {
        // If share ID fails, try regular API
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/webinars/${webinarId}`);
      }
      
      if (response.ok) {
        const result = await response.json();
        const webinar = result.webinar || result;
        setSelectedWebinar(webinar);
        setIsModalOpen(true);
      } else {
        if (window.showPopup) {
          window.showPopup('Webinar not found', 'error');
        }
        navigate('/webinars');
      }
    } catch (error) {
      console.error('Error fetching webinar by ID:', error);
      if (window.showPopup) {
        window.showPopup('Webinar not found', 'error');
      }
      navigate('/webinars');
    }
  };

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.detail.type === 'webinar') {
        fetchWebinars();
      }
    };
    
    window.addEventListener('refreshContent', handleRefresh);
    return () => window.removeEventListener('refreshContent', handleRefresh);
  }, []);

  const fetchWebinars = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/webinars`);
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
    if (id) {
      navigate('/webinars');
    }
  };

  const handleDeleteWebinar = async (webinarId) => {
    window.showConfirm('Are you sure you want to delete this webinar?', async () => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/webinars/${webinarId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setWebinars(webinars.filter(webinar => webinar._id !== webinarId));
        window.showNotification('Webinar deleted successfully!', 'success');
      }
    } catch (error) {
      window.showNotification('Error deleting webinar', 'error');
    }
    });
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
                <div key={webinar._id || webinar.id} style={{ animationDelay: `${index * 0.1}s` }} className="webinar-item">
                  <WebinarCard webinar={webinar} onClick={handleWebinarClick} />
                  {isAdmin() && (
                    <button 
                      className="admin-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWebinar(webinar._id || webinar.id);
                      }}
                      title="Delete Webinar"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
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