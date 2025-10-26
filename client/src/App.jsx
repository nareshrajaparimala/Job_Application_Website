import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobsP from './pages/JobsP';
import GovExams from './pages/GovExams';

import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import Documents from './pages/Documents';
import Admissions from './pages/Admissions';
import Webinars from './pages/Webinars';  
import Internships from './pages/Internships';
import AdmissionCards from './pages/AdmissionCards';
import TestShare from './pages/TestShare';
import FacilityManagement from './pages/FacilityManagement';
import ServiceDetail from './pages/ServiceDetail';
import Mentorship from './pages/Mentorship';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';  
import ForgotPassword from './pages/ForgotPassword';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginTest from './pages/LoginTest';
import NotificationSystem from './components/Notification/NotificationSystem';
import LoadingPage from './components/LoadingPage/LoadingPage';
import PopupNotification from './components/PopupNotification/PopupNotification';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.showPopup = (message, type = 'success') => {
      setNotification({ message, type, isVisible: true });
    };
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router >
      <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/private" element={<JobsP />} />
        <Route path="/jobs/private/:id" element={<JobsP />} />
        <Route path="/jobs/government/:id" element={<JobsP />} />
        <Route path="/gov-exams" element={<GovExams />} />
        <Route path="/gov-exams/:id" element={<GovExams />} />
        <Route path="/internships/:id" element={<Internships />} />

        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/webinars/:id" element={<Webinars />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/admission-cards" element={<AdmissionCards />} />
        <Route path="/admission-cards/:shareId" element={<AdmissionCards />} />
        <Route path="/test-share" element={<TestShare />} />
        <Route path="/test-share/:shareId" element={<TestShare />} />
        <Route path="/facility-management" element={<FacilityManagement />} />
        <Route path="/facility-management/:serviceId" element={<ServiceDetail />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/applications" element={
          <ProtectedRoute requiredRole="user">
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/user" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/test-login" element={<LoginTest />} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
      <Footer /> {/* Footer component for additional information */}
      <NotificationSystem />
      <PopupNotification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </Router>
  )
}

export default App
