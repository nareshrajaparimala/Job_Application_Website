import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import Documents from './pages/Documents';
import Admissions from './pages/Admissions';
import Webinars from './pages/Webinars';  
import Internships from './pages/internships';
import Mentorship from './pages/Mentorship';
import Contact from './pages/Contact';


function App() {
  

  return (
    <Router>
      <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer /> {/* Footer component for additional information */}
    </Router>
  )
}

export default App
