import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './Profile.css';

const Profile = () => {
  const { userDetails, setUserDetails } = useUser();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Clear session storage and fetch fresh data when userDetails change
  useEffect(() => {
    if (userDetails) {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('formData');

      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5001/orders/user/${userDetails.mobileNumber}`
          );

          if (response.data && response.data.success && response.data.orders.length > 0) {
            const userOrder = response.data.orders[0];
            setUserData(userOrder);
            setFormData(userOrder);

            // Store in session storage
            sessionStorage.setItem('userData', JSON.stringify(userOrder));
            sessionStorage.setItem('formData', JSON.stringify(userOrder));
          } else {
            setUserData(null);
            console.error('No orders found or unexpected API response:', response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);

    // Update session storage
    sessionStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/orders/user/${userDetails.mobileNumber}`,
        formData
      );
      setUserData(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');

      // Update session storage with the updated user data
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

  if (isLoading || !userData) {
    return (
      <div className="profile-container">
        <h1 className="profile-header">Profile</h1>
        <p>Loading user data...</p>
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
                name="userName"
                value={formData.userName}
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
                name="userAddress"
                value={formData.userAddress || ''}
                onChange={handleInputChange}
                className="profile-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Restaurant:</label>
              <input
                type="text"
                name="selectedRestaurant"
                value={formData.selectedRestaurant || ''}
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
              <span className="profile-label">Name:</span> {userData.userName}
            </p>
            <p className="profile-text">
              <span className="profile-label">Mobile Number:</span> {userData.mobileNumber}
            </p>
            <p className="profile-text">
              <span className="profile-label">Address:</span> {userData.userAddress}
            </p>
            <p className="profile-text">
              <span className="profile-label">Restaurant:</span> {userData.selectedRestaurant}
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
    </div>
  );
};

export default Profile;
