import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { CheckCircle, AlertCircle, Loader2, MessageSquare, Package, Coffee, Clock, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/orders/status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch order details: ${errorText}`);
      }
      const data = await response.json();
      setOrderDetails(prevDetails => ({
        ...prevDetails,
        orderStatus: data.orderStatus,
        totalAmount: data.totalAmount !== undefined ? data.totalAmount : prevDetails?.totalAmount || 0,
      }));
    } catch (err) {
      console.error('Error fetching order status:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    let newSocket;
    if (!socket) {
      newSocket = io('http://localhost:5001/orders', {
        transports: ['websocket'],
        upgrade: false,
      });
      setSocket(newSocket);
    } else {
      newSocket = socket;
    }

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      newSocket.emit('joinOrder', orderId);
    });

    newSocket.on('orderDetails', (order) => {
      console.log("Received initial order details:", order);
      updateOrderState(order);
      setIsLoading(false);
    });

    newSocket.on('orderStatusUpdated', (updatedOrder) => {
      console.log('Real-time order status update:', updatedOrder);
      updateOrderState(updatedOrder);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setError('Unable to connect to real-time updates');
      setIsLoading(false);
    });

    const statusInterval = setInterval(fetchOrderDetails, 2000);

    return () => {
      clearInterval(statusInterval);
      if (newSocket) {
        console.log('Cleaning up WebSocket connection');
        newSocket.off('connect');
        newSocket.off('orderDetails');
        newSocket.off('orderStatusUpdated');
        newSocket.off('connect_error');
        newSocket.disconnect();
      }
    };
  }, [orderId]);

  const updateOrderState = (order) => {
    setOrderDetails(prevDetails => ({
      orderId: order.orderId,
      orderStatus: order.orderStatus || prevDetails?.orderStatus,
      createdAt: order.createdAt || prevDetails?.createdAt,
      items: order.items || prevDetails?.items,
      selectedTable: order.selectedTable || prevDetails?.selectedTable,
      mobileNumber: order.mobileNumber || prevDetails?.mobileNumber,
      totalAmount: order.totalAmount !== undefined ? order.totalAmount : prevDetails?.totalAmount || 0,
    }));
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: <Clock className="status-icon pending" />,
        color: '#FF9800',
        animation: 'pulse',
        message: 'Confirming your order...'
      },
      accepted: {
        icon: <ThumbsUp className="status-icon accepted" />,
        color: '#4CAF50',
        animation: 'bounce',
        message: 'Order confirmed!'
      },
      cooking: {
        icon: <Coffee className="status-icon cooking" />,
        color: '#2196F3',
        animation: 'shake',
        message: 'Preparing your delicious meal...'
      },
      ready: {
        icon: <Package className="status-icon ready" />,
        color: '#9C27B0',
        animation: 'tada',
        message: 'Your order is ready!'
      },
      delivered: {
        icon: <CheckCircle className="status-icon delivered" />,
        color: '#4CAF50',
        animation: 'fade',
        message: 'Enjoy your meal!'
      },
      rejected: {
        icon: <AlertCircle className="status-icon rejected" />,
        color: '#f44336',
        animation: 'shake',
        message: 'Order could not be processed'
      }
    };
    return configs[status.toLowerCase()] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
        <p>Getting your order details...</p>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="error-container">
        <AlertCircle className="error-icon" />
        <h2>Oops! Something went wrong</h2>
        <p>{error || 'Unable to load order details'}</p>
        <Link to="/menu" className="return-button">Back to Menu</Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(orderDetails.orderStatus);

  return (
    <motion.div 
      className="order-success-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="order-card">
        <motion.div 
          className={`status-section ${orderDetails.orderStatus.toLowerCase()}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {statusConfig.icon}
          <h2 className="status-message" style={{ color: statusConfig.color }}>
            {statusConfig.message}
          </h2>
        </motion.div>

        <motion.div 
          className="order-info"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Order #</span>
              <span className="value">{orderDetails.orderId}</span>
            </div>
            <div className="info-item">
              <span className="label">Table</span>
              <span className="value">{orderDetails.selectedTable}</span>
            </div>
            <div className="info-item">
              <span className="label">Mobile</span>
              <span className="value">{orderDetails.mobileNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Total</span>
              <span className="value">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <motion.div 
            className="order-items"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Your Order</h3>
            <div className="items-list">
              {orderDetails.items.map((item, index) => (
                <motion.div 
                  key={index}
                  className="item"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="item-name">{item.name}</span>
                  <div className="item-details">
                    <span className="item-quantity">×{item.quantity}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            className="action-button primary"
            onClick={() => navigate(`/menu`, { state: { orderId } })}
          >
            Back to Menu
          </button>
          <Link to="/media" className="action-button secondary">
            Gallery
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;