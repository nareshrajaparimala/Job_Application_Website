import React, { useState } from 'react';
import SearchSection from '../components/Admissions/SearchSection';
import FilterAndCards from '../components/Admissions/FilterAndCards';

function Admissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: '',
    rating: '',
    course: '',
    degree: '',
    branch: '',
    studyMode: '',
  });

  return (
    <main className="admissions-main"style={{width: '100%', overflowY: 'auto'}}>
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilterAndCards searchQuery={searchQuery} filters={filters} setFilters={setFilters} />
    </main>
  );
}

export default Admissions;
