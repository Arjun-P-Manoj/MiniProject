import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="premium-hero-section">
        <div className="premium-hero-content">
          <h1 className="premium-hero-title">
            Your Journey, <span className="text-highlight">Simplified</span>
          </h1>
          <p className="premium-hero-subtitle">
            Experience seamless bus travel booking with priority seating for those who need it most.
          </p>
          <div className="premium-hero-actions">
            <Link to="/buses" className="premium-btn premium-btn-primary premium-hero-btn">
              Book Now
            </Link>
            {!currentUser && (
              <Link to="/signup" className="premium-btn premium-btn-secondary premium-hero-btn">
                Create Account
              </Link>
            )}
          </div>
        </div>
        <div className="premium-hero-image-container">
          <img 
            src={busImages.luxuryBus} 
            alt="Luxury Bus" 
            className="premium-hero-image" 
          />
          <div className="premium-hero-image-overlay"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="premium-features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Our Service?</h2>
          <p className="section-subtitle">We prioritize your comfort, safety, and convenience</p>
        </div>

        <div className="premium-features-grid">
          <div className="premium-feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 9H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2z" />
                <path d="M16 16h.01" />
                <path d="M20 9v-.5A2.5 2.5 0 0017.5 6H16V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H6.5A2.5 2.5 0 004 8.5V9" />
                <path d="M8 16h.01" />
              </svg>
            </div>
            <h3 className="feature-title">Priority Seating</h3>
            <p className="feature-description">
              We offer specialized seating for elderly and pregnant passengers, ensuring their comfort and safety.
            </p>
          </div>

          <div className="premium-feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="feature-title">Extensive Network</h3>
            <p className="feature-description">
              Wide coverage across major cities and towns with multiple route options to choose from.
            </p>
          </div>

          <div className="premium-feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="feature-title">Safe Travel</h3>
            <p className="feature-description">
              All our buses are regularly serviced and maintained to the highest safety standards.
            </p>
          </div>

          <div className="premium-feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="feature-title">24/7 Support</h3>
            <p className="feature-description">
              Our customer service team is available around the clock to assist with any questions or concerns.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="premium-how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Book your bus ticket in three simple steps</p>
        </div>

        <div className="premium-steps-container">
          <div className="premium-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Search Your Route</h3>
              <p className="step-description">
                Browse available buses on your desired route and date.
              </p>
            </div>
          </div>
          
          <div className="premium-step-connector">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="premium-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Choose Your Seat</h3>
              <p className="step-description">
                Select your preferred seat type based on your eligibility and comfort needs.
              </p>
            </div>
          </div>
          
          <div className="premium-step-connector">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="premium-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Secure Payment</h3>
              <p className="step-description">
                Complete your booking with our secure payment system and receive your e-ticket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Types Showcase */}
      <section className="premium-showcase-section">
        <div className="section-header">
          <h2 className="section-title">Our Fleet</h2>
          <p className="section-subtitle">Choose from our variety of comfortable buses</p>
        </div>

        <div className="premium-bus-showcase">
          <div className="premium-bus-card">
            <div className="premium-bus-image-container">
              <img src={busImages.regularBus} alt="Regular Bus" className="premium-bus-image" />
            </div>
            <div className="premium-bus-card-content">
              <h3 className="premium-bus-type">Regular Buses</h3>
              <p className="premium-bus-description">
                Comfortable seating with essential amenities for everyday travel needs.
              </p>
            </div>
          </div>

          <div className="premium-bus-card">
            <div className="premium-bus-image-container">
              <img src={busImages.luxuryBus} alt="Luxury Bus" className="premium-bus-image" />
            </div>
            <div className="premium-bus-card-content">
              <h3 className="premium-bus-type">Luxury Buses</h3>
              <p className="premium-bus-description">
                Premium experience with extra legroom, entertainment systems, and refreshments.
              </p>
            </div>
          </div>

          <div className="premium-bus-card">
            <div className="premium-bus-image-container">
              <img src={busImages.sleeperBus} alt="Sleeper Bus" className="premium-bus-image" />
            </div>
            <div className="premium-bus-card-content">
              <h3 className="premium-bus-type">Sleeper Buses</h3>
              <p className="premium-bus-description">
                Comfortable berths for overnight journeys, ensuring you arrive well-rested.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="premium-cta-section">
        <div className="premium-cta-content">
          <h2 className="premium-cta-title">Ready to Book Your Journey?</h2>
          <p className="premium-cta-description">
            Join thousands of satisfied travelers who choose our premium bus booking service.
          </p>
          <Link to="/buses" className="premium-btn premium-btn-primary premium-cta-btn">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 