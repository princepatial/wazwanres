import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const Modal = ({ onClose }) => {
  const [currentQuote, setCurrentQuote] = useState('');
  const navigate = useNavigate();
  
  const elegantQuotes = [
    'Where Culinary Dreams Take Flight',
    'Embark on a Journey of Flavors',
    'Discover the Art of Fine Dining',
    'Where Every Bite Tells a Story',
    'Experience Gastronomic Excellence'
  ];

  useEffect(() => {
    const randomQuote = elegantQuotes[Math.floor(Math.random() * elegantQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="close-button" onClick={onClose} aria-label="Close">
          <span className="close-icon">×</span>
        </button>

        <div className="welcome-content">
          <div className="welcome-header">
            <div className="decorative-line left"></div>
            <h1>Welcome</h1>
            <div className="decorative-line right"></div>
          </div>
          <p className="welcome-quote">{currentQuote}</p>
        </div>

        <div className="choice-cards">
          <div className="choice-card new-guest">
            <div className="card-content">
              <div className="card-header">
                <span className="accent-icon">✧</span>
                <h2>First Time Here?</h2>
                <p className="card-subtitle">Begin Your Culinary Adventure</p>
              </div>
              <div className="card-description">
                <p>"Step into a world of exquisite flavors and unforgettable dining experiences. Your journey starts here."</p>
              </div>
              <button className="action-button register" onClick={() => navigate('/new-customer')}>
                Create Account
                <span className="button-accent">→</span>
              </button>
              <div className="special-banner">
                <span className="banner-text">Welcome Gift: 10% Off Your First Visit</span>
              </div>
            </div>
          </div>

          <div className="choice-card returning-guest">
            <div className="card-content">
              <div className="card-header">
                <span className="accent-icon">♦</span>
                <h2>Welcome Back</h2>
                <p className="card-subtitle">Continue Your Gastronomic Journey</p>
              </div>
              <div className="card-description">
                <p>"Return to your favorite flavors and discover new culinary masterpieces crafted just for you."</p>
              </div>
              <button className="action-button login" onClick={() => navigate('/regular-customer')}>
                Sign In
                <span className="button-accent">→</span>
              </button>
              <div className="special-banner">
                <span className="banner-text">Member Exclusive: Earn 3x Points Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;