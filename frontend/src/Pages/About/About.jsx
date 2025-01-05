import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="swiggy-about-us">
      <h2 className="swiggy-about-us__title">ABOUT US</h2>
      <p className="swiggy-about-us__description">
        S is a new-age consumer-first organization offering an easy-to-use convenience platform, accessible through a unified app.
      </p>
      <div className="swiggy-about-us__content">
        <div className="swiggy-about-us__services">
          <div className={`swiggy-about-us__service swiggy-about-us__service--food ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0s' }}>
            <div className="swiggy-about-us__icon-container">
              <img src="/path-to-food-icon.png" alt="Food" className="swiggy-about-us__icon" />
            </div>
            <span className="swiggy-about-us__service-name">Food</span>
          </div>
          <div className={`swiggy-about-us__service swiggy-about-us__service--instamart ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="swiggy-about-us__icon-container">
              <img src="/path-to-instamart-icon.png" alt="Instamart" className="swiggy-about-us__icon" />
            </div>
            <span className="swiggy-about-us__service-name">Instamart</span>
          </div>
          <div className={`swiggy-about-us__service swiggy-about-us__service--dineout ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="swiggy-about-us__icon-container">
              <img src="/path-to-dineout-icon.png" alt="Dineout" className="swiggy-about-us__icon" />
            </div>
            <span className="swiggy-about-us__service-name">Dineout</span>
          </div>
          <div className={`swiggy-about-us__service swiggy-about-us__service--genie ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="swiggy-about-us__icon-container">
              <img src="/path-to-genie-icon.png" alt="Genie" className="swiggy-about-us__icon" />
            </div>
            <span className="swiggy-about-us__service-name">Genie</span>
          </div>
          <div className={`swiggy-about-us__service swiggy-about-us__service--minis ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <div className="swiggy-about-us__icon-container">
              <img src="/path-to-minis-icon.png" alt="Minis" className="swiggy-about-us__icon" />
            </div>
            <span className="swiggy-about-us__service-name">Minis</span>
          </div>
        </div>
        <div className={`swiggy-about-us__logo-container ${isVisible ? 'animate' : ''}`}>
          <img src="/path-to-central-logo.png" alt=" Logo" className="swiggy-about-us__logo" />
        </div>
      </div>
      <div className="swiggy-stats-section">
        <div className="swiggy-stats-grid">
          <div className="stats-card" style={{ animationDelay: '0.1s' }}>
            <div className="stats-icon">🏪</div>
            <div className="stats-number">150K+</div>
            <div className="stats-label">Restaurant Partners</div>
            <div className="stats-progress">
              <div className="progress-bar" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="stats-card" style={{ animationDelay: '0.2s' }}>
            <div className="stats-icon">🌆</div>
            <div className="stats-number">500+</div>
            <div className="stats-label">Cities Covered</div>
            <div className="stats-progress">
              <div className="progress-bar" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="stats-card" style={{ animationDelay: '0.3s' }}>
            <div className="stats-icon">📦</div>
            <div className="stats-number">2M+</div>
            <div className="stats-label">Daily Orders</div>
            <div className="stats-progress">
              <div className="progress-bar" style={{ width: '90%' }}></div>
            </div>
          </div>

          <div className="stats-card" style={{ animationDelay: '0.4s' }}>
            <div className="stats-icon">🛵</div>
            <div className="stats-number">250K+</div>
            <div className="stats-label">Delivery Partners</div>
            <div className="stats-progress">
              <div className="progress-bar" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        <div className="swiggy-mission">
          <div className="mission-content">
            <h3>Our Mission</h3>
            <p>Delivering happiness at your doorstep. We strive to provide the best food delivery experience to our customers while empowering local businesses and delivery partners.</p>
          </div>
          <div className="mission-values">
            <div className="value-item">
              <span className="value-icon">⚡</span>
              <span className="value-text">Fast Delivery</span>
            </div>
            <div className="value-item">
              <span className="value-icon">🤝</span>
              <span className="value-text">Partner Growth</span>
            </div>
            <div className="value-item">
              <span className="value-icon">💫</span>
              <span className="value-text">Quality Service</span>
            </div>
          </div>
        </div>
      </div>


      {/* Add this after the swiggy-mission div */}
      <div className="video-section">
        <div className="video-section__container">
          <div className="video-section__content">
            <h3 className="video-section__title">Delivering Happiness</h3>
            <p className="video-section__text">
              Experience the journey of how we connect millions of customers with their favorite food, groceries, and more. Our platform empowers local businesses and delivery partners while making convenience accessible to everyone.
            </p>
            <div className="video-section__features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span className="feature-text">Lightning Fast Delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💝</span>
                <span className="feature-text">Customer Satisfaction</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌟</span>
                <span className="feature-text">Quality Assurance</span>
              </div>
            </div>
            <button className="video-section__cta">Learn More</button>
          </div>

          <div className="video-section__video-container">
            <div className="video-wrapper">
              <video
                className="featured-video"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <div className="play-button">
                  <span>▶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;