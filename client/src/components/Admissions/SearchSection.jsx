// --- SearchSection.jsx ---
import React from 'react';
import './SearchSection.css';

function SearchSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="text-center ">
      <h1 >Here you can get the admission details</h1>
      <div className="">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, place or course..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" aria-label="Search">
            🔍
          </button>
        </div>
      </div>
    </section>
  );
}
export default SearchSection;