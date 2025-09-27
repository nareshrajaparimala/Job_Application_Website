// src/pages/Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import './ResumeSection.css';
import jobSearchImg from '../assets/searchJob.svg';
import '../components/ScrollAnimations.css';
import { useScrollAnimation } from '../components/useScrollAnimation';
import JobCard from '../components/Jobs/JobCard';
import { sampleJobs } from '../components/Jobs/jobData';



const industries = ["All", "IT & Software", "Education", "Engineering", "Healthcare", "Private", "Government"];
const experiences = ["All", "Entry", "Mid", "Senior"];
const locations = ["All", "Bangalore, India", "Chennai, India", "Delhi, India", "Hyderabad, India", "Mumbai, India", "Pune, India"];

export default function Home() {
  const [industry, setIndustry] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchSuggestions = [
    { title: "Government Jobs", url: "/jobs/government", type: "page", description: "Browse all government job openings" },
    { title: "Private Jobs", url: "/jobs/private", type: "page", description: "Explore private sector opportunities" },
    { title: "Software Developer", url: "/jobs/government", type: "job", description: "Government software development positions" },
    { title: "Full Stack Developer", url: "/jobs/private", type: "job", description: "Private sector development roles" },
    { title: "Data Analyst", url: "/jobs/government", type: "job", description: "Government data analysis positions" },
    { title: "UI/UX Designer", url: "/jobs/private", type: "job", description: "Design roles in private companies" },
    { title: "Results", url: "/results", type: "page", description: "Check exam results and notifications" },
    { title: "Admit Cards", url: "/admit-card", type: "page", description: "Download admit cards for exams" },
    { title: "Internships", url: "/internships", type: "page", description: "Find internship opportunities" },
    { title: "College Admissions", url: "/admissions", type: "page", description: "College admission information" }
  ];
  
  const filteredSuggestions = searchSuggestions.filter(item =>
    item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    item.description.toLowerCase().includes(globalSearch.toLowerCase())
  );
  
  const handleGlobalSearch = (value) => {
    setGlobalSearch(value);
    setShowSuggestions(value.length > 0);
  };
  
  const handleSuggestionClick = (url) => {
    window.location.href = url;
    setShowSuggestions(false);
    setGlobalSearch("");
  };
  useEffect(() => {
    setLoading(true);
    
    // Combine government and private jobs, sort by datePosted (most recent first) and take only latest 6
    const allJobs = [...sampleJobs.government, ...sampleJobs.private];
    const sortedJobs = allJobs
      .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
      .slice(0, 6);
    
    setJobs(sortedJobs);
    setLoading(false);
  }, []);
  
  const handleJobClick = (job) => {
    // Redirect to appropriate job section based on job company type
    if (job.company?.toLowerCase().includes('government') || job.company?.toLowerCase().includes('ministry')) {
      window.location.href = '/jobs/government';
    } else {
      window.location.href = '/jobs/private';
    }
  };

  const searchBarRef = useRef(null);

  // Apply scroll animations
  //  ref={useScrollAnimation('move-in-left')} 
  const heroImageRef = useScrollAnimation('move-in-right');
  const quickLinksRef = useScrollAnimation('move-in-bottom');
  const featuredJobsRef = useScrollAnimation('move-in-top');

  const filteredJobs = jobs.filter(job =>
    (industry === "All" || job.category === industry || job.type === industry) &&
    (experience === "All" || job.experienceLevel === experience) &&
    (location === "All" || job.location?.toLowerCase().includes(location.toLowerCase())) &&
    (search.trim() === "" ||
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleScrollToSearch = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchBarRef.current.querySelector('input')?.focus();
    }
  };

  return (
    <div>
      {/* Global Search Bar */}
      <div className="global-search-section">
        <div className="global-search-container">
          <div className="global-search-wrapper">
            <input
              type="text"
              className="global-search-input"
              placeholder="Search for jobs, pages, results, admissions..."
              value={globalSearch}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              onFocus={() => setShowSuggestions(globalSearch.length > 0)}
            />
            <button className="global-search-btn">
              <i className="ri-search-line"></i>
            </button>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="search-suggestions">
                {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion.url)}
                  >
                    <div className="suggestion-icon">
                      {suggestion.type === 'job' ? '💼' : '📄'}
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-title">{suggestion.title}</div>
                      <div className="suggestion-desc">{suggestion.description}</div>
                    </div>
                    <i className="ri-arrow-right-line suggestion-arrow"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text" ref={useScrollAnimation('move-in-left')}>
          <h1>Find the Right Job. Build Your Career with <span> MytechZ</span>.</h1>

          <p className="hero-subtext">
            Government & Private Jobs • Admit Cards • Results • Internships — All in One Place
          </p>
          <div className="hero-buttons">
            <button className="resume-btn">📩 Post Your Resume</button>
            <button className="explore-btn" onClick={handleScrollToSearch}>🔍 Explore Jobs</button>
          </div>
        </div>
        <div className="hero-image" ref={useScrollAnimation('move-in-right')}>
          <img src={jobSearchImg} alt="Job Search" />
        </div>
      </div>

      {/* portfolio maker */}
      <div className='portfolio-maker-section' ref={useScrollAnimation('move-in-left')}>
        <div className="portfolio-maker-content">
          <div className="portfolio-maker-icon">
            <i className="ri-briefcase-4-line animated-icon"></i>
          </div>
          <h2 className="portfolio-maker-title">Create Your Personal Portfolio</h2>
          <p className="portfolio-maker-description">
            Build a stunning personal portfolio or website to showcase your skills and achievements.
          </p>
          <button 
            className="portfolio-cta-btn"
            onClick={() => window.location.href = '/portfolio'}
          >
            <i className="ri-rocket-line"></i>
            Get Your Own Portfolio
          </button>
        </div>
      </div>
      {/* Resume Section */}
      <div className="resume-section" ref={useScrollAnimation('move-in-right')}>
        <div className="resume-content">
          <h2 className="resume-title">Build Your Professional Resume</h2>
          <p className="resume-description">
            Create a standout resume with our professional templates and get noticed by top employers.
          </p>
          <div className="resume-features">
            <div className="feature-icon">
              <i className="ri-file-text-line"></i>
              <span>Professional Templates</span>
            </div>
            <div className="feature-icon">
              <i className="ri-palette-line"></i>
              <span>Customizable Design</span>
            </div>
            <div className="feature-icon">
              <i className="ri-download-line"></i>
              <span>Best ATS score</span>
            </div>
          </div>
          <button 
            className="resume-cta-btn"
            onClick={() => window.location.href = '/documents'}
          >
            <i className="ri-rocket-line"></i>
            Get Ready My First Resume
          </button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-section">
        <h2 className="quick-links-title">Fast Access to Resources</h2>
        <div className="quick-links-list "  ref={useScrollAnimation('move-in-bottom')}  >
          {[
            { href: "/jobs/government", label: "Government Jobs", icon: "🏛️" },
            { href: "/jobs/private", label: "Private Jobs", icon: "🏢" },
            // { href: "/results", label: "Results", icon: "📢" },
            // { href: "/admit-card", label: "Admit Cards", icon: "📄" },
            // { href: "/answer-keys", label: "Answer Keys", icon: "✅" },
            { href: "/admissions", label: "College Admissions", icon: "🏫" },
            { href: "/documents", label: "Resume Creation", icon: "📑" },
            // { href: "/mentorship", label: "Mentorship Programs", icon: "🤝" },
            { href: "/webinars", label: "Webinars & Workshops", icon: "🎓" },
            { href: "/internships", label: "Internship Listings", icon: "🌐" },
          ].slice(0, window.innerWidth <= 768 ? 6 : 10).map(link => (
            <a href={link.href} className="quick-link-card" key={link.href}>
              {link.icon}<span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="featured-jobs-section " >
        <h2 className="featured-jobs-title">Latest Job Openings</h2>
        <div className="integrated-search-section" ref={useScrollAnimation('move-in-top')}>
          <div className="search-with-filters" ref={searchBarRef}>
            <div className="search-input-container">
              <input
                type="text"
                className="job-search-input"
                placeholder="Search job title or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="job-search-icon" tabIndex={-1} aria-label="Search">
                <i className="ri-search-line"></i>
              </button>
            </div>
            <div className="inline-filters">
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="filter-select">
                <option value="All">All Industries</option>
                {industries.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={experience} onChange={e => setExperience(e.target.value)} className="filter-select">
                <option value="All">All Experience</option>
                {experiences.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={location} onChange={e => setLocation(e.target.value)} className="filter-select">
                <option value="All">All Locations</option>
                {locations.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="jobs-grid" ref={useScrollAnimation('move-in-bottom')}>
          {loading ? (
            <div className="loading-msg">Loading latest jobs...</div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.slice(0, window.innerWidth <= 768 ? 3 : 6).map((job) => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))
          ) : (
            <div className="no-jobs-msg">No jobs found for selected filters.</div>
          )}
        </div>
        

      </div>

      {/* Services Section */}
      <div className="service-highlights-section "  >
        <h2 className="service-highlights-title">We Offer More Than Just Jobs</h2>
        <div className="service-highlights-list" ref={useScrollAnimation('move-in-right')}>
          <div className="service-card">🧠<span>Career Guidance</span></div>
          <div className="service-card">📋<span>Resume Writing</span></div>
          <div className="service-card">🗣<span>Interview Preparation</span></div>
          <div className="service-card">🧾<span>Document Services<br/>(PAN, Aadhaar, etc.)</span></div>
          <div className="service-card">🏫<span>College Admission Help</span></div>
          <div className="service-card">🌍<span>Webinars & Events</span></div>
        </div>
      </div>

      {/* Job Categories */}
      <div className="categories-section">
        <h2 className="categories-title">Explore Job Sectors</h2>
        <ul className="categories-list" ref={useScrollAnimation('move-in-left')}>
          <li>🏛 Government Jobs</li>
          <li>💼 Private Company Roles</li>
          <li>💻 IT & Software</li>
          <li>📚 Education & Teaching</li>
          <li>⚙️ Engineering</li>
          <li>🏥 Healthcare</li>
        </ul>
        <a href="/categories" className="view-all-categories">→ View All Categories</a>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-list">
          <div className="testimonial-card">
            <span className="testimonial-quote">“MytechZ helped me find my first internship!”</span>
            <span className="testimonial-user">– Asha, Bangalore</span>
          </div>
          <div className="testimonial-card">
            <span className="testimonial-quote">“Very useful for government job updates.”</span>
            <span className="testimonial-user">– Rahul, Mysore</span>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <h2 className="newsletter-title">Stay Updated – Get Job Alerts in Your Inbox</h2>
        <form
          className="newsletter-form"
          onSubmit={e => {
            e.preventDefault();
            alert("Subscribed!");
          }}
          ref={useScrollAnimation('move-in-bottom')}
        >
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="newsletter-btn">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}