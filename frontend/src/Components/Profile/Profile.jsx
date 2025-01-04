import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Profile.css';

const Profile = () => {
  const { userDetails, setUserDetails } = useUser();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  useEffect(() => {
    if (userDetails) {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('formData');

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
            sessionStorage.setItem('userData', JSON.stringify(userCustomer));
            sessionStorage.setItem('formData', JSON.stringify(userCustomer));
          } else {
            console.error('No customer found or unexpected API response:', response.data);
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
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
    sessionStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/customers/update-customer?mobileNumber=${userDetails.mobileNumber}`,
        formData
      );
      setUserData(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
      sessionStorage.setItem('userData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (!userDetails) {
    return (
      <div className="profile-container">
        <h1 className="profile-header">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="profile-container">
        <h1 className="profile-header">Profile</h1>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <h1 className="profile-header">Profile</h1>
        <p>Unable to load profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profile</h1>
      <div className="profile-card">
        {isEditing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label className="profile-form-label">Name:</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="profile-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Mobile Number:</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                readOnly
                className="profile-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="profile-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Restaurant:</label>
              <input
                type="text"
                name="likeRestaurant"
                value={formData.likeRestaurant || ''}
                onChange={handleInputChange}
                className="profile-input"
              />
            </div>
            <div className="profile-form-buttons">
              <button type="submit" className="profile-button">
                Save
              </button>
              <button
                type="button"
                className="profile-button profile-button-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="profile-text">
              <span className="profile-label">Name:</span> {userData.customerName}
            </p>
            <p className="profile-text">
              <span className="profile-label">Mobile Number:</span> {userData.mobileNumber}
            </p>
            <p className="profile-text">
              <span className="profile-label">Address:</span> {userData.address}
            </p>
            <p className="profile-text">
              <span className="profile-label">Restaurant:</span> {userData.likeRestaurant}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="profile-button"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="orders-section">
        <h2>Order History</h2>
        {isOrdersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.orderId}>
                <p>Order ID: {order.orderId}</p>
                <p>Table: {order.selectedTable}</p>
                <p>Status: {order.orderStatus}</p>
                <p>Total Amount: ₹{order.totalAmount}</p>
                <p>Payment Method: {order.paymentDetails ? order.paymentDetails.paymentMethod : 'N/A'}</p>
                <p>Payment Status: {order.paymentDetails ? order.paymentDetails.status : 'N/A'}</p>
                <p>Items:</p>
                <ul>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <li key={index}>{item.name} - {item.quantity} x ₹{item.price}</li>
                    ))
                  ) : (
                    <li>No items found</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;