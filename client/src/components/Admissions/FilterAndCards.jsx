import React, { useEffect, useState } from 'react';
import './FilterAndCards.css';
import collegeData from './data/college_admission_data/collegesData.json';
import { useNavigate } from 'react-router-dom';

function FilterAndCards({ searchQuery, filters, setFilters }) {
  const [colleges, setColleges] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const collegesPerPage = 6;
  const navigate = useNavigate();

  // Popup state
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Filter & Sort Function
  const applyFilters = () => {
    let filtered = [...collegeData];

    // Search Query
    if (searchQuery) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating Filter
    if (filters.rating) {
      filtered = filtered.filter(college => college.rating >= Number(filters.rating));
    }

    // Course Filter
    if (filters.course) {
      filtered = filtered.filter(college =>
        college.courses.includes(filters.course)
      );
    }

    // Degree, Branch, Study Mode (if present in your data model)
    if (filters.degree) {
      filtered = filtered.filter(college => college.degree === filters.degree);
    }

    if (filters.branch) {
      filtered = filtered.filter(college => college.branch === filters.branch);
    }

    if (filters.studyMode) {
      filtered = filtered.filter(college => college.studyMode === filters.studyMode);
    }

    // Sort
    if (filters.sortBy === 'costHighToLow') {
      filtered.sort((a, b) => b.fee - a.fee);
    } else if (filters.sortBy === 'costLowToHigh') {
      filtered.sort((a, b) => a.fee - b.fee);
    }

    // Pagination
    const total = Math.ceil(filtered.length / collegesPerPage);
    const startIndex = (page - 1) * collegesPerPage;
    const paginated = filtered.slice(startIndex, startIndex + collegesPerPage);

    setColleges(paginated);
    setTotalPages(total);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, page]);
// Handle Filter Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page on filter change
  };

  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

// Handle Apply Button
  const handleApply = async (college) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      console.log('Applying to college:', college.name);
      console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL}/api/colleges/apply`);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/colleges/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ college }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        console.error('Application failed:', data);
        alert(data.message || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying to college:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Open popup on card click except apply button
  const handleCardClick = (college, e) => {
    // Prevent popup if apply button clicked
    if (e.target.classList.contains('collegeApply')) {
      return;
    }
    setSelectedCollege(college);
    setIsPopupOpen(true);
  };

  // Close popup on outside click
  const handlePopupClose = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      setIsPopupOpen(false);
      setSelectedCollege(null);
    }
  };

  return (
    <section className="admissions-container-section">
      {/* Filters */}
      <div className="admissions-container-filter">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="inner-filter-container ">
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="filter-select">
            <option value="">Sort by Cost</option>
            <option value="costHighToLow">High to Low</option>
            <option value="costLowToHigh">Low to High</option>
          </select>
          <select name="rating" value={filters.rating} onChange={handleFilterChange} className="filter-select">
            <option value="">Ratings</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} stars & up</option>
            ))}
          </select>
          <select name="course" value={filters.course} onChange={handleFilterChange} className="filter-select">
            <option value="">Stream / Course</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="BBA">BBA</option>
          </select>
          <select name="degree" value={filters.degree} onChange={handleFilterChange} className="filter-select">
            <option value="">Degree</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
          </select>
          <select name="branch" value={filters.branch} onChange={handleFilterChange} className="filter-select">
            <option value="">Branch</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Business">Business</option>
          </select>
          <select name="studyMode" value={filters.studyMode} onChange={handleFilterChange} className="filter-select">
            <option value="">Study Mode</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="admissions-container-cards">
        {colleges.length === 0 ? (
          <p>No colleges found for selected filters.</p>
        ) : (
          colleges.map((college, index) => (
            <div key={index} className="outerCard" onClick={(e) => handleCardClick(college, e)}>
              <h3 className="collegeHead">{college.name}</h3>
              <p>Rating: {college.rating}</p>
              <p>Courses: {college.courses.join(', ')}</p>
              <p>Details: {college.details}</p>
              <button className="collegeApply" onClick={() => handleApply(college)}>Apply</button>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="admissions-pagination">
          <button onClick={handlePrevPage} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedCollege && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCollege.name}</h2>
            <p><strong>Rating:</strong> {selectedCollege.rating}</p>
            <p><strong>Courses:</strong> {selectedCollege.courses.join(', ')}</p>
            <p><strong>Details:</strong> {selectedCollege.details}</p>

            <h3>Overview</h3>
            <p>{selectedCollege.overview || 'No overview available.'}</p>

            <h3>Placement</h3>
            <ul>
              <li><strong>Average Package:</strong> {selectedCollege.placement?.averagePackage || 'N/A'}</li>
              <li><strong>Highest Package:</strong> {selectedCollege.placement?.highestPackage || 'N/A'}</li>
              <li><strong>Top Recruiters:</strong> {selectedCollege.placement?.topRecruiters?.join(', ') || 'N/A'}</li>
            </ul>

            <h3>Recent Stats ({selectedCollege.recent?.year || 'N/A'})</h3>
            <ul>
              <li><strong>Placement Percentage:</strong> {selectedCollege.recent?.placementPercentage || 'N/A'}%</li>
              <li><strong>Highest Internship Stipend:</strong> {selectedCollege.recent?.highestInternshipStipend || 'N/A'}</li>
            </ul>

            <h3>Courses & Fees</h3>
            <ul>
              {selectedCollege.coursesFees?.map((course, idx) => (
                <li key={idx}>{course.name}: {course.fee}</li>
              )) || <li>N/A</li>}
            </ul>

            <h3>Cutoffs</h3>
            <ul>
              {selectedCollege.cutoffs?.map((cutoff, idx) => (
                <li key={idx}>{cutoff.course}: Rank {cutoff.cutoffRank}</li>
              )) || <li>N/A</li>}
            </ul>

            <h3>Admissions</h3>
            <p>{selectedCollege.admissions || 'No admissions info available.'}</p>

            <h3>Reviews</h3>
            <ul>
              <li><strong>Students:</strong> {selectedCollege.reviews?.students || 'N/A'}</li>
              <li><strong>Placements:</strong> {selectedCollege.reviews?.placements || 'N/A'}</li>
              <li><strong>Infrastructure:</strong> {selectedCollege.reviews?.infrastructure || 'N/A'}</li>
            </ul>

            <h3>Facilities</h3>
            <p>{selectedCollege.facilities?.join(', ') || 'N/A'}</p>

            <button className="collegeApply" onClick={() => handleApply(selectedCollege)}>Apply</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default FilterAndCards;


// naresh