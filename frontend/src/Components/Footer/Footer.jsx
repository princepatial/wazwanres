import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube  } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Wazwan Resturants</h2>
          <p>Culinary Excellence Since 1995</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/feedback">Feedback</Link>
          <Link to="/media">Gallery</Link>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/p/Wazwan-Legacy-61556216672676/" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="https://www.instagram.com/wazwan_legacy/?hl=en" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="https://www.youtube.com/channel/UCdLrussL6OhwsmEHnZ1ZDsw" aria-label="Youtube"><FontAwesomeIcon icon={faYoutube} /></a>
        </div>
      </div>
      <div className="footer-info">
        <div className="info-item">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>Mohali</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faPhone} />
          <span>+91 88470-26594</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>contact.wazwan@gmail.com</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p id='color'>&copy; {new Date().getFullYear()} Wazwan Legacy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
