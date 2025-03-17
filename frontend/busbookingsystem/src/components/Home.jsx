import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bus Booking System</h1>
          <p className="hero-subtitle">
            Experience seamless bus travel with our enterprise-grade booking platform. 
            Find the best routes, book tickets instantly, and enjoy a comfortable journey across the country.
          </p>
          <Link to="/buses" className="hero-cta">
            Book Your Journey
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Our Service Benefits</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Enterprise-Grade Platform</h3>
              <p className="feature-description">
                Our advanced booking system is built for reliability and performance, ensuring your journey planning is seamless and efficient at all times.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Transactions</h3>
              <p className="feature-description">
                Industry-leading security protocols protect your personal and payment information, giving you complete peace of mind when booking.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                </svg>
              </div>
              <h3 className="feature-title">Comprehensive Coverage</h3>
              <p className="feature-description">
                Access an extensive network of routes covering major business hubs, metropolitan areas, and regional destinations throughout the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="steps-content">
          <h2 className="section-title">Streamlined Booking Process</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Select Your Route</h3>
              <p className="step-description">
                Enter your departure and destination locations in our intelligent search system to find optimal route options based on your schedule requirements.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Choose Your Service</h3>
              <p className="step-description">
                Compare available services with detailed information on amenities, schedules, and pricing to select the option that best meets your needs.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Confirm & Pay</h3>
              <p className="step-description">
                Complete your reservation with our secure payment gateway, receiving instant confirmation and digital tickets for a paperless travel experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready for a Superior Travel Experience?</h2>
          <p className="cta-description">
            Join the thousands of satisfied clients who rely on our professional bus booking system for their transportation needs.
          </p>
          <Link to="/signup" className="cta-button">
            Register Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 