import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../Pages/Cart/CartContext';
import { useUser } from '../Profile/UserContext';
import axios from 'axios';
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


const LoggedInUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 0 1 5-5z" />
    <path d="M15 14a7 7 0 0 1 7 7H2a7 7 0 0 1 7-7h6z" />
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <path d="M16 9a4 4 0 0 0-8 0" stroke="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { userDetails, setUserDetails } = useUser();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { cartItemCount, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
    }
  }, [userDetails]);

  useEffect(() => {
    const savedUserDetails = sessionStorage.getItem('userDetails');
    if (savedUserDetails) {
      setUserDetails(JSON.parse(savedUserDetails));
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userDetails?.mobileNumber) {
        setLoadingProfile(true);
        try {
          const response = await axios.get(`http://localhost:5001/customers/get-customer?mobileNumber=${userDetails.mobileNumber}`);
          if (response.status === 200 && response.data.customer) {
            const { customer } = response.data;
            setUserProfile({ name: customer.customerName, mobileNumber: customer.mobileNumber });
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setUserProfile(null);
      }
    };
    fetchUserDetails();
  }, [userDetails]);

  const handleLogout = () => {
    setUserDetails(null);
    setUserProfile(null);
    clearCart();
    sessionStorage.removeItem('userDetails');
    setIsProfilePopupOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('menu-open');
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleProfilePopup = (e) => {
    e.stopPropagation();
    setIsProfilePopupOpen(!isProfilePopupOpen);
  };

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
            <div className="nav-link user-link" onClick={toggleProfilePopup}>
              {userDetails ? (
                <div className="logged-in-user" title="Profile">
                  <LoggedInUserIcon />
                </div>
              ) : (
                <UserIcon />
              )}
              {isProfilePopupOpen && (
                <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
                  {loadingProfile ? (
                    <div className="profile-popup-content">
                      <p>Loading profile...</p>
                    </div>
                  ) : (
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
                      {userProfile ? (
                        <>
                          <div className="profile-header">
                            <div className="profile-avatar">
                              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <h2>Profile</h2>
                          </div>
                          <div className="profile-info">
                            <div className="info-item1">
                              <span className="label">Name:</span>
                              <span className="value">{userProfile.name}</span>
                            </div>
                            <div className="info-item1">
                              <span className="label">Number:</span>
                              <span className="value">{userProfile.mobileNumber}</span>
                            </div>
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
                            <button className="logout-button" onClick={handleLogout}>
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
                  )}
                </div>
              )}
            </div>
            {userDetails && (
              <>
                <NavLink to="/checkout" className="nav-link cart-link" onClick={handleLinkClick} title="Cart">
                  <CartIcon />
                  {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </NavLink>
                <button
                  className="nav-link logout-nav-button"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
