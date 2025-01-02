import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../Pages/Cart/CartContext';
import { useUser } from '../Profile/UserContext';
import './Navbar.css';
import logoImage from '../../assets/wazwan.png';

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const { userDetails } = useUser();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('menu-open');
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  // Toggle profile popup
  const toggleProfilePopup = (e) => {
    e.stopPropagation(); // Prevent click propagation
    setIsProfilePopupOpen(!isProfilePopupOpen);
  };

  // Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsProfilePopupOpen(false);
    if (isProfilePopupOpen) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isProfilePopupOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <NavLink to="/" onClick={handleLinkClick}>
            <img src={logoImage} alt="WazwaN" className="logo-image" />
          </NavLink>
        </div>

        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={handleLinkClick}>
            Home
          </NavLink>
          <NavLink to="/menu" className="nav-link" onClick={handleLinkClick}>
            Menu
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={handleLinkClick}>
            About
          </NavLink>
          <div className="nav-actions">
            <div
              className="nav-link user-link"
              onClick={toggleProfilePopup}
            >
              {userDetails && userDetails.userName ? (
                <div className="logged-in-user">
                  <span className="user-initial">
                    {userDetails.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <UserIcon />
              )}

              {isProfilePopupOpen && (
                <div
                  className="profile-popup"
                  onClick={(e) => e.stopPropagation()}
                  style={{ zIndex: 1000 }}
                >
                  <div className="profile-popup-content">
                    <button
                      className="close-popup-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfilePopupOpen(false);
                      }}
                    >
                      <CloseIcon />
                    </button>
                    {userDetails && userDetails.userName ? (
                      <>
                        <h2>Profile</h2>
                        <div className="profile-info">
                          <p>
                            <span className="label">Name:</span> {userDetails.userName}
                          </p>
                          <p>
                            <span className="label">Number:</span> {userDetails.mobileNumber}
                          </p>
                          <p>
                            <span className="label">Restaurant:</span>{' '}
                            {userDetails.selectedRestaurant}
                          </p>
                        </div>
                        <div className="profile-actions">
                          <button
                            className="edit-profile-button"
                            onClick={() => {
                              navigate('/profile');
                              setIsProfilePopupOpen(false);
                            }}
                          >
                            Edit Profile
                          </button>
                          <button
                            className="logout-button"
                            onClick={() => {
                              
                              setIsProfilePopupOpen(false);
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2>Please login first</h2>
                        <div className="profile-actions">
                          <button
                            className="login-button"
                            onClick={() => {
                              navigate('/'); 
                              setIsProfilePopupOpen(false);
                            }}
                          >
                            Login
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
            <NavLink to="/checkout" className="nav-link cart-link" onClick={handleLinkClick}>
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;