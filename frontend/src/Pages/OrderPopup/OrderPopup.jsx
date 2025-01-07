import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Clock } from 'lucide-react';
import './OrderPopup.css';

const OrderPopup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [tempHidden, setTempHidden] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem('orderTimeLeft');
    return savedTime ? parseInt(savedTime) : 300; // Default to 5 minutes (300 seconds)
  });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState(null);
  const [isPermanentlyClosed, setIsPermanentlyClosed] = useState(
    sessionStorage.getItem('doNotShowAgain') === 'true'
  );

  const excludedPaths = ['/checkout', '/order-success'];
  const isExcludedPath = excludedPaths.some(path => location.pathname.includes(path));

  // Handle order ID updates
  useEffect(() => {
    const storedOrderId = sessionStorage.getItem('currentOrderId');
    const newOrderId = location.state?.orderId;
    const doNotShowAgain = sessionStorage.getItem('doNotShowAgain');

    if (newOrderId && newOrderId !== storedOrderId) {
      sessionStorage.setItem('currentOrderId', newOrderId);
      sessionStorage.removeItem('doNotShowAgain');
      setTempHidden(false);
      setOrderId(newOrderId);
      setIsPermanentlyClosed(false);
      setTimeLeft(300); // Reset timer to 5 minutes for new order
      sessionStorage.setItem('orderTimeLeft', '300');
      setIsTimerActive(false); // Don't start timer yet
    } else if (storedOrderId && !doNotShowAgain) {
      setOrderId(storedOrderId);
      const savedTime = sessionStorage.getItem('orderTimeLeft');
      if (savedTime) {
        setTimeLeft(parseInt(savedTime)); // Resume timer from saved time
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (!orderId || isExcludedPath || isPermanentlyClosed) return;

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5001/orders/status/${orderId}`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch order status');
        const data = await response.json();
        handleOrderStatusUpdate(data.orderStatus);
      } catch (err) {
        console.error('Error fetching order status:', err);
        setError('Failed to fetch order status');
      }
    };

    fetchOrderStatus();

    const intervalId = setInterval(fetchOrderStatus, 2000);

    return () => clearInterval(intervalId);
  }, [orderId, isExcludedPath, isPermanentlyClosed]);

  const handleOrderStatusUpdate = (status) => {
    console.log('OrderPopup handling status update:', status);
    setOrderStatus(status);

    if (status === 'ready') {
      setIsPopupVisible(false);
      setIsTimerActive(false);
      sessionStorage.removeItem('currentOrderId');
      sessionStorage.removeItem('orderTimeLeft');
    } else if (status === 'accepted') {
      setIsTimerActive(true); // Start the timer when status is accepted
      setIsPopupVisible(!isPermanentlyClosed && !tempHidden);
    } else if (['cooking', 'pending'].includes(status)) {
      setIsPopupVisible(!isPermanentlyClosed && !tempHidden);
    }
  };

  const handleTemporaryClose = () => {
    setTempHidden(true);
    setIsPopupVisible(false);
  
    
    setTimeout(() => {
      if (!isPermanentlyClosed) {
        setTempHidden(false);
        setIsPopupVisible(true);
      }
    }, 20000);
  };
  

  const handlePermanentClose = () => {
    setIsPopupVisible(false);
    setIsPermanentlyClosed(true);
    sessionStorage.setItem('doNotShowAgain', 'true');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusAnimation = () => {
    switch (orderStatus) {
      case 'accepted':
        return 'animation-accepted';
      case 'cooking':
        return 'animation-cooking';
      case 'pending':
        return 'animation-pending';
      default:
        return '';
    }
  };

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'accepted':
        return 'Your order has been accepted and will be prepared soon!';
      case 'cooking':
        return 'Your food is being prepared with care!';
      case 'pending':
        return 'Your order is being confirmed... Please wait!';
      case 'ready':
        return 'Your order is ready for pickup!';
      case 'delivered':
        return 'Enjoy your meal!';
      case 'rejected':
        return "We're sorry, but your order was not processed.";
      default:
        return 'Fetching the status of your order...';
    }
  };

  useEffect(() => {
    let timerInterval;

    if (isTimerActive) {
      timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timerInterval);
            return 0;
          }
          const newTime = prevTime - 1;
          sessionStorage.setItem('orderTimeLeft', newTime.toString());
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isTimerActive]);

  if (!isPopupVisible || isExcludedPath || isPermanentlyClosed || tempHidden) {
    return null; 
  }
  

  return (
    <div className="order-popup-container animated-slide-up">
      <div className={`status-animation ${getStatusAnimation()}`}>
        {orderStatus === 'cooking' && (
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
        )}
        {orderStatus === 'accepted' && (
          <div className="timer-display">
            {formatTime(timeLeft)}
          </div>
        )}
        {orderStatus === 'pending' && (
          <div className="pending-animation">
            <div className="pending-dot"></div>
            <div className="pending-dot"></div>
            <div className="pending-dot"></div>
          </div>
        )}
      </div>
      <div className="popup-content">
        <p>{getStatusMessage()}</p>
        {error && <p className="error-message">{error}</p>}
        <div className="popup-actions">
          <button
            className="view-order-btn"
            onClick={() => navigate(`/order-success/${orderId}`)}
          >
            View Order
          </button>
          <div className="control-buttons">
            <button
              className="control-btn temporary"
              onClick={handleTemporaryClose}
              title="Hide for 20 seconds"
            >
              <Clock size={18} />
            </button>
            <button
              className="control-btn permanent"
              onClick={handlePermanentClose}
              title="Don't show again"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
