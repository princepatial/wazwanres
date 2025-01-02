import React,{useState} from 'react';
import { useUser } from '../Profile/UserContext';
import './Profile.css';



const Profile = () => {
    const { userDetails, setUserDetails } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      userName: userDetails?.userName || '',
      mobileNumber: userDetails?.mobileNumber || '',
      selectedRestaurant: userDetails?.selectedRestaurant || '',
    });
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`http://localhost:5001/orders/${userDetails.orderId}`, formData);
        setUserDetails({
          ...userDetails,
          ...formData
        });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error('Failed to update profile');
      }
    };
  
    if (!userDetails) {
      return <div className="profile-container">Please log in to view your profile.</div>;
    }
  
    return (
      <div className="profile-container">
        <h1>Profile Page</h1>
        <div className="profile-card">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number:</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Restaurant:</label>
                <input
                  type="text"
                  name="selectedRestaurant"
                  value={formData.selectedRestaurant}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <p><span className="label">Name:</span> {userDetails.userName}</p>
              <p><span className="label">Number:</span> {userDetails.mobileNumber}</p>
              <p><span className="label">Restaurant:</span> {userDetails.selectedRestaurant}</p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    );
  };


export default Profile;
