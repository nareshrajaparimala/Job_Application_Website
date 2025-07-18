import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobsP from './pages/JobsP';
import JobsG from './pages/JobsG';
import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import Documents from './pages/Documents';
import Admissions from './pages/Admissions';
import Webinars from './pages/Webinars';  
import Internships from './pages/internships';
import Mentorship from './pages/Mentorship';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';  
import Profile from './pages/Profile';


function App() {
  return (
    <Router >
      <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/private" element={<JobsP />} />
        <Route path="/jobs/government" element={<JobsG />} />
        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
      <Footer /> {/* Footer component for additional information */}
    </Router>
  )
}

export default App
