import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title animate-fade-in">
            Get in Touch with <span className="highlight">MytechZ</span>
          </h1>
          <p className="contact-hero-subtitle animate-fade-in-delay">
            We're here to help you build your career and achieve your goals
          </p>
        </div>
        <div className="contact-hero-decoration">
          <div className="floating-icon">
            <i className="ri-mail-line"></i>
          </div>
          <div className="floating-icon delay-1">
            <i className="ri-phone-line"></i>
          </div>
          <div className="floating-icon delay-2">
            <i className="ri-map-pin-line"></i>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title animate-slide-up">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-card animate-slide-up">
              <div className="team-avatar" style={{borderRadius:"50%", overflow:"hidden"}}>
                {/* <i className="ri-user-line"></i> */}
                <img src="./assets/RaviKumar(img).png" alt="Ravi Kumar HS - Founder & MD" style={{height:"100px", width:"100px"}}/>
              </div>
              <div className="team-info">
                <h3>Ravi Kumar HS</h3>
                <p className="team-role">Founder & MD</p>
                <div className="team-contact">
                  <a href="tel:6361718992" className="contact-link">
                    <i className="ri-phone-line"></i>
                    +91 6361718992
                  </a>
                  <a href="mailto:ravikumarsamyak@gmail.com" className="contact-link">
                    <i className="ri-mail-line"></i>
                    ravikumarsamyak@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card animate-slide-up delay-1">
              <div className="team-avatar" style={{borderRadius:"50%", overflow:"hidden"}}>
                {/* <i className="ri-user-line"></i> */}
                <img src="./assets/Naresh(img).png" alt="Naresh R - Co-Founder & CEO" style={{height:"100px", width:"100px"}}/>
              </div>
              <div className="team-info">
                <h3>Naresh R</h3>
                <p className="team-role">Co-Founder & CEO</p>
                <div className="team-contact">
                  <a href="tel:8884509528" className="contact-link">
                    <i className="ri-phone-line"></i>
                    +91 8884509528
                  </a>
                  <a href="mailto:nareshrajaparimala000@gmail.com" className="contact-link">
                    <i className="ri-mail-line"></i>
                    nareshrajaparimala000@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card animate-slide-up delay-2">
              <div className="team-avatar" style={{borderRadius:"50%", overflow:"hidden"}}>
                {/* <i className="ri-user-line"></i> */}
                <img src="./assets/PrajwalGowda(img).png" alt="Prajwal Gowda A - Leading AI Consultant & CMO" style={{height:"80px", width:"90px"}}/>
              </div>
              <div className="team-info">
                <h3>Prajwal Gowda A</h3>
                <p className="team-role">Leading AI Consultant & CMO</p>
                <div className="team-contact">
                  <a href="mailto:contact@mytechz.com" className="contact-link">
                    <i className="ri-mail-line"></i>
                    prajwalgowdaa544@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="team-card animate-slide-up delay-3">
              <div className="team-avatar">
                <i className="ri-team-line"></i>
              </div>
              <div className="team-info">
                <h3>Our Amazing Team</h3>
                <p className="team-role">Developers, Designers & More</p>
                <div className="team-contact">
                  <a href="mailto:team@mytechz.com" className="contact-link">
                    <i className="ri-mail-line"></i>
                    team@mytechz.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section animate-slide-left">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your Phone"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line spinning"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i>
                      Send Message
                    </>
                  )}
                </button>
                {submitStatus === 'success' && (
                  <div className="success-message animate-fade-in">
                    <i className="ri-check-line"></i>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section animate-slide-right">
              <h2>Get in Touch</h2>
              <div className="contact-info">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="ri-map-pin-line"></i>
                  </div>
                  <div className="info-content">
                    <h4>Our Office</h4>
                    <p>Bangalore, Karnataka<br />India</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="ri-phone-line"></i>
                  </div>
                  <div className="info-content">
                    <h4>Phone Numbers</h4>
                    <p>
                      <a href="tel:6361718992">+91 6361718992</a> (Ravi Kumar)<br />
                      <a href="tel:8884509528">+91 8884509528</a> (Naresh R) <br/>
                      <a href="tel:8310541180">+91 8310541180</a> (Prajwal Gowda)
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="ri-mail-line"></i>
                  </div>
                  <div className="info-content">
                    <h4>Email Addresses</h4>
                    <p>
                      <a href="mailto:ravikumarsamyak@gmail.com">ravikumarsamyak@gmail.com</a><br />
                      <a href="mailto:nareshrajaparimala000@gmail.com">nareshrajaparimala000@gmail.com</a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="ri-time-line"></i>
                  </div>
                  <div className="info-content">
                    <h4>Business Hours</h4>
                    <p>
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-links">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    <i className="ri-linkedin-line"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="ri-twitter-line"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="ri-facebook-line"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="ri-instagram-line"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title animate-slide-up">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item animate-slide-up">
              <h4>How can I apply for jobs through MytechZ?</h4>
              <p>Simply browse our job listings, create your profile, and click apply on any job that interests you. We'll handle the rest!</p>
            </div>
            <div className="faq-item animate-slide-up delay-1">
              <h4>Do you provide career guidance?</h4>
              <p>Yes! Our team offers personalized career guidance, resume building, and interview preparation services.</p>
            </div>
            <div className="faq-item animate-slide-up delay-2">
              <h4>Is MytechZ free to use?</h4>
              <p>Basic job search and application services are free. Premium services like resume building may have associated costs.</p>
            </div>
            <div className="faq-item animate-slide-up delay-3">
              <h4>How do I get updates about new opportunities?</h4>
              <p>Subscribe to our newsletter or follow us on social media to get the latest job updates and career tips.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact