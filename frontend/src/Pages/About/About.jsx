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
    </div>
  );
};

export default About;