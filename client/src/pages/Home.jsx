// src/pages/Home.jsx
import React,{useState ,useRef} from 'react';
import './Home.css'; // Import your CSS file for styling
import jobSearchImg from '../assets/searchJob.svg'; // Adjust the path as necessary

// Example job data
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
  },{
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
  // Filter state
  const [industry, setIndustry] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch] = useState("");
  const searchBarRef = useRef(null);

  // Filtered jobs
  const filteredJobs = jobsData.filter(job =>
    (industry === "All" || job.industry === industry) &&
    (experience === "All" || job.experience === experience) &&
    (location === "All" || job.location === location) &&
    (search.trim() === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()))
  );
  // Scroll to search bar when Search Jobs button is clicked
  const handleScrollToSearch = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchBarRef.current.querySelector('input')?.focus();
    }
  };
  
  return <div>
    {/*sector1   */}
    <div className="hero-section">
      {/* Left: Text */}
      <div className="hero-text">
        <h1>
          Find the Right Job. Build Your Career with <span>Hire Loop</span>.
        </h1>
        <p className="hero-subtext">
          Government & Private Jobs • Admit Cards • Results • Internships — All in One Place
        </p>
        <div className="hero-buttons">
          <button className="search-btn" onClick={handleScrollToSearch}>🔍 Search Jobs</button>
          <button className="resume-btn">📩 Post Your Resume</button>
        </div>
      </div>
      {/* Right: Image */}
      <div className="hero-image">
        <img src={jobSearchImg} alt="Job Search" />
      </div>
    </div>


    

        {/* Quick Links Section */}
      <div className="quick-links-section">
        <h2 className="quick-links-title">Fast Access to Resources</h2>
        <div className="quick-links-list">
            <a href="/jobs/government" className="quick-link-card">🏛️<span>Government Jobs</span></a>
            <a href="/jobs/private" className="quick-link-card">🏢<span>Private Jobs</span></a>
            <a href="/results" className="quick-link-card">📢<span>Results</span></a>
            <a href="/admit-card" className="quick-link-card">📄<span>Admit Cards</span></a>
          <a href="/answer-keys" className="quick-link-card">✅<span>Answer Keys</span></a>
           
          <a href="/admissions" className="quick-link-card">🏫<span>College Admissions</span></a>
             
            <a href="/documents" className="quick-link-card">📑<span>Document Verification</span></a>
            <a href="/mentorship" className="quick-link-card">🤝<span>Mentorship Programs</span></a>
            <a href="/webinars" className="quick-link-card">🎓<span>Webinars & Workshops</span></a>
          <a href="/internships" className="quick-link-card">🌐<span>Internship Listings</span></a>
        </div>
      </div>


{/* Featured Jobs Section */}
      <div className="featured-jobs-section">
        <h2 className="featured-jobs-title">Latest Job Openings</h2>

        <div className="job-filters-searchbar-wrap">
          <div className="job-filters">
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
        <center>
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
         

        <div className="job-cards-list">
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

       {/* Service Highlights Section */}
      <div className="service-highlights-section">
        <h2 className="service-highlights-title">We Offer More Than Just Jobs</h2>
        <div className="service-highlights-list">
          <div className="service-card">🧠<span>Career Guidance</span></div>
          <div className="service-card">📋<span>Resume Writing</span></div>
          <div className="service-card">🗣<span>Interview Preparation</span></div>
          <div className="service-card">🧾<span>Document Services<br/>(PAN, Aadhaar, etc.)</span></div>
          <div className="service-card">🏫<span>College Admission Help</span></div>
          <div className="service-card">🌍<span>Webinars & Events</span></div>
        </div>
      </div>

{/* job sector */}
     <div className="categories-section">
        <h2 className="categories-title">Explore Job Sectors</h2>
        <ul className="categories-list">
          <li>🏛 Government Jobs</li>
          <li>💼 Private Company Roles</li>
          <li>💻 IT &amp; Software</li>
          <li>📚 Education &amp; Teaching</li>
          <li>⚙️ Engineering</li>
          <li>🏥 Healthcare</li>
        </ul>
        <a href="/categories" className="view-all-categories">→ View All Categories</a>
      </div>

    {/* Testimonials / Trust Section */}
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

    
{/* Newsletter Signup Section */}
      <div className="newsletter-section">
        <h2 className="newsletter-title">Stay Updated – Get Job Alerts in Your Inbox</h2>
        <form
          className="newsletter-form"
          onSubmit={e => {
            e.preventDefault();
            // Add your subscribe logic here
          }}
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

  </div>;
}


 