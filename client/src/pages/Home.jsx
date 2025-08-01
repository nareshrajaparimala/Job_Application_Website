// src/pages/Home.jsx
import React, { useState, useRef } from 'react';
import './Home.css';
import jobSearchImg from '../assets/searchJob.svg';
import '../components/ScrollAnimations.css';
import { useScrollAnimation } from '../components/useScrollAnimation';

const jobsData = [
  {
    title: "Software Engineer",
    company: "TechNova Pvt Ltd",
    location: "Bangalore, India",
    industry: "IT & Software",
    experience: "Mid",
  },
  {
    title: "Assistant Professor",
    company: "Bright Future College",
    location: "Chennai, India",
    industry: "Education",
    experience: "Entry",
  },
  {
    title: "Civil Engineer",
    company: "UrbanBuild Infra",
    location: "Delhi, India",
    industry: "Engineering",
    experience: "Mid",
  },
  {
    title: "Staff Nurse",
    company: "CarePlus Hospital",
    location: "Hyderabad, India",
    industry: "Healthcare",
    experience: "Entry",
  },
  {
    title: "Marketing Executive",
    company: "MarketMinds",
    location: "Mumbai, India",
    industry: "Private",
    experience: "Mid",
  },
  {
    title: "Data Analyst",
    company: "Govt. Data Center",
    location: "Pune, India",
    industry: "Government",
    experience: "Entry",
  },
];

const industries = ["All", "IT & Software", "Education", "Engineering", "Healthcare", "Private", "Government"];
const experiences = ["All", "Entry", "Mid", "Senior"];
const locations = ["All", "Bangalore, India", "Chennai, India", "Delhi, India", "Hyderabad, India", "Mumbai, India", "Pune, India"];

export default function Home() {
  const [industry, setIndustry] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch] = useState("");

  const searchBarRef = useRef(null);

  // Apply scroll animations
  //  ref={useScrollAnimation('move-in-left')} 
  const heroImageRef = useScrollAnimation('move-in-right');
  const quickLinksRef = useScrollAnimation('move-in-bottom');
  const featuredJobsRef = useScrollAnimation('move-in-top');

  const filteredJobs = jobsData.filter(job =>
    (industry === "All" || job.industry === industry) &&
    (experience === "All" || job.experience === experience) &&
    (location === "All" || job.location === location) &&
    (search.trim() === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()))
  );

  const handleScrollToSearch = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchBarRef.current.querySelector('input')?.focus();
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text" ref={useScrollAnimation('move-in-left')}>
          <h1>
            Find the Right Job. Build Your Career with <span> Hire Loop</span>.
          </h1>
          <p className="hero-subtext">
            Government & Private Jobs • Admit Cards • Results • Internships — All in One Place
          </p>
          <div className="hero-buttons">
            <button className="search-btn" onClick={handleScrollToSearch}>🔍 Search Jobs</button>
            <button className="resume-btn">📩 Post Your Resume</button>
          </div>
        </div>
        <div className="hero-image" ref={useScrollAnimation('move-in-right')}>
          <img src={jobSearchImg} alt="Job Search" />
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-section">
        <h2 className="quick-links-title">Fast Access to Resources</h2>
        <div className="quick-links-list "  ref={useScrollAnimation('move-in-bottom')}  >
          {[
            { href: "/jobs/government", label: "Government Jobs", icon: "🏛️" },
            { href: "/jobs/private", label: "Private Jobs", icon: "🏢" },
            { href: "/results", label: "Results", icon: "📢" },
            { href: "/admit-card", label: "Admit Cards", icon: "📄" },
            { href: "/answer-keys", label: "Answer Keys", icon: "✅" },
            { href: "/admissions", label: "College Admissions", icon: "🏫" },
            { href: "/documents", label: "Document Verification", icon: "📑" },
            { href: "/mentorship", label: "Mentorship Programs", icon: "🤝" },
            { href: "/webinars", label: "Webinars & Workshops", icon: "🎓" },
            { href: "/internships", label: "Internship Listings", icon: "🌐" },
          ].map(link => (
            <a href={link.href} className="quick-link-card" key={link.href}>
              {link.icon}<span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="featured-jobs-section " >
        <h2 className="featured-jobs-title">Latest Job Openings</h2>
        <div className="job-filters-searchbar-wrap" ref={useScrollAnimation('move-in-top')} >
          <div className="job-filters" ref={useScrollAnimation('move-in-top')}>
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              {industries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={experience} onChange={e => setExperience(e.target.value)}>
              {experiences.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              {locations.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <center ref={useScrollAnimation('move-in-top')}>
          <div className="job-searchbar" ref={searchBarRef}>
            <input
              type="text"
              className="job-search-input"
              placeholder="Search job title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="job-search-icon" tabIndex={-1} aria-label="Search">
              <span role="img" aria-label="search">🔍</span>
            </button>
          </div>
        </center>

        <div className="job-cards-list" ref={useScrollAnimation('move-in-bottom')}>
          {filteredJobs.slice(0, 6).map((job, idx) => (
            <div className="job-card" key={idx}>
              <div className="job-card-title">{job.title}</div>
              <div className="job-card-company">{job.company}</div>
              <div className="job-card-location">{job.location}</div>
              <button className="apply-btn">Apply Now</button>
            </div>
          ))}
          {filteredJobs.length === 0 && (
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
            <span className="testimonial-quote">“Hire Loop helped me find my first internship!”</span>
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