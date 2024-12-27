import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPopup.css';

const OrderPopup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Define excluded paths
  const excludedPaths = ['/order-success', '/track-order'];
  const isExcludedPath = excludedPaths.some(path => location.pathname.includes(path));

  // Manage popup visibility based on order status and excluded paths
  useEffect(() => {
    const storageOrderStatus = localStorage.getItem('orderStatus');
    const storageOrderId = localStorage.getItem('orderId');
    const popupClosedForReady = localStorage.getItem('popupClosedForReady');

    // Show popup only if:
    // 1. Order status is 'accepted'
    // 2. Not on excluded path
    // 3. Either the order is not 'ready' or the popup hasn't been closed before
    if (storageOrderStatus === 'accepted' && 
        !isExcludedPath && 
        !(storageOrderStatus === 'ready' && popupClosedForReady === 'true')) {
      setOrderStatus(storageOrderStatus);
      setOrderId(storageOrderId);
      setIsPopupVisible(true);
    } else {
      setIsPopupVisible(false);
    }
  }, [location.pathname, isExcludedPath]);

  // Close popup and set flag if order is ready
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    const currentOrderStatus = localStorage.getItem('orderStatus');
    
    // If order status is 'ready', set flag in localStorage
    if (currentOrderStatus === 'ready') {
      localStorage.setItem('popupClosedForReady', 'true');
    }
  };

  // Do not render the popup if it's not visible
  if (!isPopupVisible) {
    return null;
  }

  return (
    <div className="order-popup-container animated-slide-up">
      <div className="cooking-animation">
        <div className="pot">
          <div className="steam">
            <div className="steam-line"></div>
            <div className="steam-line"></div>
            <div className="steam-line"></div>
          </div>
        </div>
        <div className="spatula"></div>
      </div>
      <div className="popup-content">
        <p>Your food is preparing with care!</p>
        <div className="popup-actions">
          <button 
            className="view-order-btn" 
            onClick={() => navigate(`/order-success/${orderId}`)}
          >
            View Order
          </button>
          <button className="close-btn" onClick={handleClosePopup}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;