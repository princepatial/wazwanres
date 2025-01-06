import React, { useEffect, useState, useRef } from 'react';
import aboutVideo from '../../assets/aboutvideo.mp4';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const navigate = useNavigate();

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  const handleLearnMore = () => {
    // Redirect to the current page
    navigate(0);
  };

  useEffect(() => {
    const video = videoRef.current;

    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const showControlsOnPause = () => {
      setShowControls(true);
    };

    video.addEventListener('play', () => {
      setIsPlaying(true);
      setTimeout(hideControls, 3000);
    });

    video.addEventListener('pause', showControlsOnPause);

    return () => {
      video.removeEventListener('play', hideControls);
      video.removeEventListener('pause', showControlsOnPause);
    };
  }, [isPlaying]);


  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="wazwan-about-us">
      <h2 className="wazwan-about-us__title">ABOUT US</h2>
      <p className="wazwan-about-us__description">
  Welcome to Wazwan — the ultimate destination for lovers of rich, flavorful, and authentic non-veg cuisine. From sizzling grills to hearty curries, we bring the best of tradition straight to your plate, delivered with a touch of modern convenience. Dive into a feast that’s as bold as your cravings!
</p>

      <div className="wazwan-about-us__content">
        <div className="wazwan-about-us__services">
          <div className={`wazwan-about-us__service wazwan-about-us__service--food ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0s' }}>
            <div className="wazwan-about-us__icon-container">
              <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt="Food" className="wazwan-about-us__icon" />
            </div>
            <span className="wazwan-about-us__service-name">Res 1</span>
          </div>
          <div className={`wazwan-about-us__service wazwan-about-us__service--instamart ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="wazwan-about-us__icon-container">
              <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt="Instamart" className="wazwan-about-us__icon" />
            </div>
            <span className="wazwan-about-us__service-name">Res 2</span>
          </div>
          <div className={`wazwan-about-us__service wazwan-about-us__service--dineout ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="wazwan-about-us__icon-container">
              <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt="Dineout" className="wazwan-about-us__icon" />
            </div>
            <span className="wazwan-about-us__service-name">Res 3</span>
          </div>
          <div className={`wazwan-about-us__service wazwan-about-us__service--genie ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="wazwan-about-us__icon-container">
              <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt="Genie" className="wazwan-about-us__icon" />
            </div>
            <span className="wazwan-about-us__service-name">Res 4</span>
          </div>
          <div className={`wazwan-about-us__service wazwan-about-us__service--minis ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <div className="wazwan-about-us__icon-container">
              <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt="Minis" className="wazwan-about-us__icon" />
            </div>
            <span className="wazwan-about-us__service-name">Res 5</span>
          </div>
        </div>
        <div className={`wazwan-about-us__logo-container ${isVisible ? 'animate' : ''}`}>
          <img src="https://marketplace.canva.com/EAFaFUz4aKo/2/0/800w/canva-yellow-abstract-cooking-fire-free-logo-iY2pBFWGLgU.jpg" alt=" Logo" className="wazwan-about-us__logo" />
        </div>
      </div>
      <div className="wazwan-stats-section">


        <div className="wazwan-mission">
          <div className="mission-content">
            <h3>Our Mission</h3>
            <p>Bringing happiness right to your table. We aim to deliver the best dining experience by seamlessly connecting you with exceptional in-restaurant service and local culinary delights.</p>
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


      {/* Add this after the wazwan-mission div */}
      <div className="video-section">
        <div className="video-section__container">
          <div className="video-section__content">
            <h3 className="video-section__title">Spreading Happiness</h3>
            <p className="video-section__text">
              Experience the journey of how we connect millions of customers with their favorite food, delicious taste, and more. Our platform empowers local businesses and delivery partners while making convenience accessible to everyone.
            </p>
            <div className="video-section__features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span className="feature-text">Lightning Fast Order</span>
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
            <button className="video-section__cta" onClick={handleLearnMore}>Learn More</button>
          </div>

          <div className="video-section__video-container">
            <div className="video-wrapper">
              <video
                className="featured-video"
                muted
                loop
                playsInline
                onClick={togglePlayPause}
                ref={videoRef}
              >
                <source src={aboutVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay" style={{ opacity: showControls ? 1 : 0 }}>
                <div className="control-button" onClick={togglePlayPause}>
                  <span className="play-icon" style={{ display: isPlaying ? 'none' : 'block' }}>▶</span>
                  <span className="pause-icon" style={{ display: isPlaying ? 'block' : 'none' }}>❚❚</span>
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