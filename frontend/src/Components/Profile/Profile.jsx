import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { FiEdit2, FiUser, FiPhone, FiMapPin, FiShoppingBag, FiClock } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { userDetails, setUserDetails } = useUser();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    likeRestaurant: ''
  });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (userDetails?.mobileNumber) {
      const fetchUserData = async () => {
        setIsProfileLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5001/customers/get-customer?mobileNumber=${userDetails.mobileNumber}`
          );

          if (response.data && response.data.customer) {
            const userCustomer = response.data.customer;
            setUserData(userCustomer);
            setFormData(userCustomer);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsProfileLoading(false);
        }
      };

      const fetchOrders = async () => {
        setIsOrdersLoading(true);
        try {
          const orderResponse = await axios.get(
            `http://localhost:5001/orders/${userDetails.mobileNumber}`
          );

          if (orderResponse.data && orderResponse.data.orders) {
            setOrders(orderResponse.data.orders);
          } else {
            setOrders([]);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } finally {
          setIsOrdersLoading(false);
        }
      };

      fetchUserData();
      fetchOrders();
    } else {
      setIsProfileLoading(false);
      setIsOrdersLoading(false);
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails?.mobileNumber) return;

    try {
      await axios.put(
        `http://localhost:5001/customers/update-customer?mobileNumber=${userDetails.mobileNumber}`,
        formData
      );
      setUserData(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (!userDetails) {
    return (
      <div className="restaurant-profile">
        <div className="auth-message">
          <FiUser className="auth-icon" />
          <h2>Welcome to Your Profile</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="restaurant-profile">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile">
      <div className="profile-header-section">
        <div className="profile-cover"></div>
        <div className="profile-avatar">
          <FiUser className="avatar-icon" />
        </div>
        <h1>{userData?.customerName || 'Welcome'}</h1>
      </div>

      <div className="profile-navigation">
        <button 
          className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </button>
        <button 
          className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' ? (
          <div className="profile-details">
            {isEditing ? (
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <FiUser className="field-icon" />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName || ''}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <FiPhone className="field-icon" />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber || ''}
                    readOnly
                    className="readonly"
                  />
                </div>
                <div className="form-group">
                  <FiMapPin className="field-icon" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Your Address"
                  />
                </div>
                <div className="form-group">
                  <FiShoppingBag className="field-icon" />
                  <input
                    type="text"
                    name="likeRestaurant"
                    value={formData.likeRestaurant || ''}
                    onChange={handleInputChange}
                    placeholder="Liked Resturant Service"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                {userData && (
                  <>
                    <div className="info-card">
                      <FiUser className="info-icon" />
                      <div className="info-content">
                        <label>Name</label>
                        <p>{userData.customerName || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="info-card">
                      <FiPhone className="info-icon" />
                      <div className="info-content">
                        <label>Mobile Number</label>
                        <p>{userData.mobileNumber || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="info-card">
                      <FiMapPin className="info-icon" />
                      <div className="info-content">
                        <label>Address</label>
                        <p>{userData.address || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="info-card">
                      <FiShoppingBag className="info-icon" />
                      <div className="info-content">
                        <label>Liked Resturant</label>
                        <p>{userData.likeRestaurant || 'Not specified'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="edit-button"
                    >
                      <FiEdit2 /> Edit Profile
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="order-history">
            <h2>Your Order History</h2>
            {isOrdersLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.orderId} className="order-card1">
                    <div className="order-header">
                      <span className="order-id">Order #{order.orderId}</span>
                      <span className={`order-status ${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="order-info">
                        <p><strong>Table:</strong> {order.selectedTable}</p>
                        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                        <p><strong>Payment:</strong> {order.paymentDetails?.paymentMethod || 'N/A'}</p>
                        <p><strong>Status:</strong> {order.paymentDetails?.status || 'N/A'}</p>
                      </div>
                      <div className="order-items1">
                        <h4>Ordered Items</h4>
                        <ul>
                          {order.items?.map((item, index) => (
                            <li key={index}>
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">₹{item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <FiClock className="no-orders-icon" />
                <p>No orders found in your history.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;