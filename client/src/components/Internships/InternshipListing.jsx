import React, { useState, useEffect } from 'react';
import InternshipSearch from './InternshipSearch';
import InternshipFilters from './InternshipFilters';
import InternshipCard from './InternshipCard';
import InternshipModal from './InternshipModal';
import { sampleInternships } from './internshipData';
import './InternshipListing.css';
import '../AdminDeleteButton.css';

const isAdmin = () => {
  const user = localStorage.getItem('user');
  return user && JSON.parse(user).role === 'admin';
};

function InternshipListing() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    stipend: '',
    duration: '',
    workMode: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.detail.type === 'internship') {
        fetchInternships();
      }
    };
    
    window.addEventListener('refreshContent', handleRefresh);
    return () => window.removeEventListener('refreshContent', handleRefresh);
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/internships`);
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
        setFilteredInternships(data);
      } else {
        setInternships(sampleInternships);
        setFilteredInternships(sampleInternships);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships(sampleInternships);
      setFilteredInternships(sampleInternships);
    }
  };

  useEffect(() => {
    let filtered = [...internships];

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter(internship =>
        internship.location.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(internship =>
        internship.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.stipend) {
      filtered = filtered.filter(internship => {
        const stipendAmount = parseInt(internship.stipend.replace(/[^0-9]/g, ''));
        const filterAmount = parseInt(filters.stipend.replace(/[^0-9]/g, ''));
        return stipendAmount >= filterAmount;
      });
    }

    if (filters.duration) {
      filtered = filtered.filter(internship => internship.duration === filters.duration);
    }

    if (filters.workMode) {
      filtered = filtered.filter(internship => internship.workMode === filters.workMode);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.datePosted) - new Date(a.datePosted);
        case 'oldest':
          return new Date(a.datePosted) - new Date(b.datePosted);
        case 'stipend-high':
          const aStipend = parseInt(a.stipend.split('-')[1] || a.stipend.split('-')[0]);
          const bStipend = parseInt(b.stipend.split('-')[1] || b.stipend.split('-')[0]);
          return bStipend - aStipend;
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });

    setFilteredInternships(filtered);
  }, [internships, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleInternshipClick = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  const handleDeleteInternship = async (internshipId) => {
    window.showConfirm('Are you sure you want to delete this internship?', async () => {
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/internships/${internshipId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setInternships(internships.filter(internship => internship._id !== internshipId));
        window.showNotification('Internship deleted successfully!', 'success');
      }
    } catch (error) {
      window.showNotification('Error deleting internship', 'error');
    }
    });
  };

  return (
    <div className="internship-listing-container">
      <InternshipSearch onSearch={handleSearch} />
      
      <div className="internship-content">
        <div className="filters-section">
          <InternshipFilters onFilterChange={handleFilterChange} />
        </div>
        
        <div className="internships-section">
          <div className="internships-header">
            <h2>{filteredInternships.length} Internships Found</h2>
            <p>Discover amazing internship opportunities</p>
          </div>
          
          <div className="internships-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship, index) => (
                <div key={internship._id || internship.id} style={{ animationDelay: `${index * 0.1}s` }} className="internship-item">
                  <InternshipCard internship={internship} onClick={handleInternshipClick} />
                  {isAdmin() && (
                    <button 
                      className="admin-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInternship(internship._id || internship.id);
                      }}
                      title="Delete Internship"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-internships">
                <i className="ri-search-line"></i>
                <h3>No internships found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <InternshipModal 
        internship={selectedInternship} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default InternshipListing;