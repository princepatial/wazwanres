import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../Components/Profile/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import './RegularCustomer.css';

const RegularCustomer = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUserDetails } = useUser(); // Context hook for passing user data
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch tables from the server
  const fetchTables = async () => {
    try {
      const response = await axios.get('http://13.239.200.245:5000/api/tables');
      if (response.status === 200) {
        const sortedTables = response.data.sort((a, b) => a.tableNumber - b.tableNumber);
        setTables(sortedTables);
      } else {
        throw new Error('Failed to fetch tables');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Unable to fetch tables. Please try again later.');
      setTables([]);
      setLoading(false);
    }
  };

  // Handle mobile number input changes (only allows numbers)
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
    if (value.length <= 10) {
      setMobileNumber(value); // Update mobile number state
    }
  };

  // Handle table selection
  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
    toast.success(`Table ${tableNumber} selected!`);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      toast.error('Please select a table!');
      return;
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number!');
      return;
    }

    try {
      // Updated API URL to check customer by mobile number
      const response = await axios.get(`http://localhost:5001/customers/get-customer?mobileNumber=${mobileNumber}`);

      if (response.status === 200 && response.data.customer) {
        // User found, set the user details in context
        const userDetails = { selectedTable, mobileNumber, customer: response.data.customer };
        setUserDetails(userDetails);
        toast.success('Mobile number validated successfully!');
        navigate('/menu'); // Navigate to the menu page after success
      } else {
        toast.error('Mobile number not found. Please register as a new customer.');
      }
    } catch (error) {
      // Handle errors based on the status code
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Mobile number not found in our system. Please register.');
        } else if (error.response.status === 500) {
          toast.error('Internal Server Error. Please try again later.');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } else if (error.request) {
        toast.error('No response from the server. Please check your connection or try again later.');
      } else {
        toast.error('Failed to validate user. Please try again.');
      }
    }
  };

  return (
    <div className="prefixed-regular-booking-page">
      <div className="prefixed-regular-booking-container">
        <header className="prefixed-regular-booking-header">
          <div className="prefixed-restaurant-logo" style={{ marginTop: '4rem' }}>
            <span className="prefixed-logo-text">W</span>
          </div>
          <h1>Welcome Back to Wazwan</h1>
          <p className="prefixed-header-subtitle">Select your table to continue</p>
        </header>

        <div className="prefixed-regular-booking-content">
          <section className="prefixed-tables-section">
            <h2>Select Your Table
              <span className="prefixed-required-marker">*</span>
            </h2>
            {loading ? (
              <div className="prefixed-modern-loader">
                <div className="prefixed-loader-spinner"></div>
                <p>Loading tables...</p>
              </div>
            ) : (
              <div className="prefixed-modern-tables-grid">
                {tables.map((table) => (
                  <button
                    key={table._id}
                    className={`prefixed-modern-table-card ${selectedTable === table.tableNumber ? 'selected' : ''} ${table.status.toLowerCase()}`}
                    onClick={() => handleTableClick(table.tableNumber)}
                    disabled={table.status !== 'Available'}
                  >
                    <div className="prefixed-table-content">
                      <span className="prefixed-table-number">Table {table.tableNumber}</span>
                      <span className="prefixed-table-status">{table.status}</span>
                    </div>
                    <div className="prefixed-selection-indicator"></div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="prefixed-contact-section">
            <h2>Enter Your Mobile Number</h2>
            <form onSubmit={handleSubmit} className="prefixed-modern-form">
              <div className="prefixed-input-container">
                <label className="prefixed-input-label">
                  Mobile Number <span className="prefixed-required-marker">*</span>
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter mobile number"
                  className="prefixed-modern-input"
                  required
                />
              </div>
              <button type="submit" className="prefixed-modern-submit-btn">
                Validate & Proceed
              </button>
            </form>
          </section>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default RegularCustomer;
