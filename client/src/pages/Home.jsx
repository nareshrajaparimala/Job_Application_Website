// src/pages/Home.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import './ResumeSection.css';
import jobSearchImg from '../assets/searchJob.svg';
import '../components/ScrollAnimations.css';
import { useScrollAnimation } from '../components/useScrollAnimation';
import JobCard from '../components/Jobs/JobCard';
import { sampleJobs } from '../components/Jobs/jobData';
import ResumeManager from '../components/Resume/ResumeManager';



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
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
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
                      {suggestion.type === 'job' ? <i className="ri-briefcase-line"></i> : <i className="ri-file-text-line"></i>}
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
            <button 
              className="resume-btn" 
              onClick={() => {
                if (isLoggedIn) {
                  setShowResumeManager(true);
                } else {
                  window.location.href = '/login';
                }
              }}
            >
              <i className="ri-mail-line"></i> Post Your Resume
            </button>
            <button className="explore-btn" onClick={handleScrollToSearch}><i className="ri-search-line"></i> Explore Jobs</button>
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

      {/* Facility Management Section */}
      <div className="facility-section" ref={useScrollAnimation('move-in-left')}>
        <div className="facility-content">
          <h2 className="facility-title">Professional Facility Management</h2>
          <p className="facility-description">
            "Excellence in facility management is not just about maintaining spaces, it's about creating environments where success thrives."
          </p>
          <div className="facility-features">
            <div className="feature-icon">
              <i className="ri-building-line"></i>
              <span>Infrastructure Management</span>
            </div>
            <div className="feature-icon">
              <i className="ri-shield-check-line"></i>
              <span>Security & Safety</span>
            </div>
            <div className="feature-icon">
              <i className="ri-tools-line"></i>
              <span>Maintenance Services</span>
            </div>
          </div>
          <button 
            className="facility-cta-btn"
            onClick={() => window.location.href = '/facility-management'}
          >
            <i className="ri-building-4-line"></i>
            Explore Our Services
          </button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-section">
        <h2 className="quick-links-title">Fast Access to Resources</h2>
        <div className="quick-links-list "  ref={useScrollAnimation('move-in-bottom')}  >
          {[
            { href: "/jobs/private", label: "Private Jobs", icon: "ri-building-line" },
            { href: "/gov-exams", label: "Government Exams", icon: "ri-government-line" },
            // { href: "/results", label: "Results", icon: "📢" },
            // { href: "/admit-card", label: "Admit Cards", icon: "ri-file-text-line" },
            // { href: "/answer-keys", label: "Answer Keys", icon: "ri-check-line" },
            { href: "/admissions", label: "College Admissions", icon: "ri-school-line" },
            { href: "/documents", label: "Resume Creation", icon: "ri-file-text-line" },
            // { href: "/mentorship", label: "Mentorship Programs", icon: "🤝" },
            { href: "/webinars", label: "Webinars & Workshops", icon: "ri-graduation-cap-line" },
            { href: "/internships", label: "Internship Listings", icon: "ri-global-line" },
          ].slice(0, window.innerWidth <= 768 ? 6 : 10).map(link => (
            <a href={link.href} className="quick-link-card" key={link.href}>
              {link.icon.startsWith('ri-') ? <i className={link.icon}></i> : link.icon}<span>{link.label}</span>
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
          <div className="service-card" onClick={() => window.showNotification('Career guidance service coming soon!', 'info')}>
            <i className="ri-lightbulb-line"></i><span>Career Guidance</span>
          </div>
          <div className="service-card" onClick={() => window.location.href = '/documents'}>
            <i className="ri-file-text-line"></i><span>Resume Writing</span>
          </div>
          <div className="service-card" onClick={() => window.showNotification('Interview preparation service coming soon!', 'info')}>
            <i className="ri-mic-line"></i><span>Interview Preparation</span>
          </div>
          <div className="service-card" onClick={() => window.showNotification('Document services coming soon!', 'info')}>
            <i className="ri-file-list-line"></i><span>Document Services<br/>(PAN, Aadhaar, etc.)</span>
          </div>
          <div className="service-card" onClick={() => window.location.href = '/admissions'}>
            <i className="ri-school-line"></i><span>College Admission Help</span>
          </div>
          <div className="service-card" onClick={() => window.location.href = '/webinars'}>
            <i className="ri-global-line"></i><span>Webinars & Events</span>
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <div className="categories-section">
        <h2 className="categories-title">Explore Job Sectors</h2>
        <ul className="categories-list" ref={useScrollAnimation('move-in-left')}>
          <li><i className="ri-briefcase-line"></i> Private Company Roles</li>
          <li><i className="ri-computer-line"></i> IT & Software</li>
          <li><i className="ri-book-line"></i> Education & Teaching</li>
          <li><i className="ri-settings-line"></i> Engineering</li>
          <li><i className="ri-hospital-line"></i> Healthcare</li>
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
      
      {/* Resume Manager Modal */}
      {showResumeManager && (
        <ResumeManager onClose={() => setShowResumeManager(false)} />
      )}
    </div>
  );
}