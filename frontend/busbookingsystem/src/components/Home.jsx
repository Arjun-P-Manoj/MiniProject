import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <h1 className="hero-title">Modern Bus Booking System</h1>
          <p className="hero-subtitle">Experience seamless bus travel with our cutting-edge booking platform</p>
          <Link to="/bookings/add" className="hero-button">Book Your Journey</Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose Our Platform</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">24/7 Booking</h3>
            <p className="feature-description">Book your bus tickets anytime, anywhere with our round-the-clock service.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="feature-title">Safe Travel</h3>
            <p className="feature-description">Regular maintenance and safety checks ensure your journey is secure.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Best Prices</h3>
            <p className="feature-description">Competitive pricing with regular discounts and special offers.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Search Buses</h3>
            <p className="step-description">Find available buses for your desired route and date</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Select Seats</h3>
            <p className="step-description">Choose your preferred seats from the interactive seat map</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Book Tickets</h3>
            <p className="step-description">Complete your booking with secure payment options</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3 className="step-title">Travel</h3>
            <p className="step-description">Board your bus and enjoy a comfortable journey</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-pattern"></div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">Book your bus tickets now and experience hassle-free travel</p>
          <Link to="/bookings/add" className="cta-button">Book Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 