import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { useUser } from '../../Components/Profile/UserContext';
import './NewCustomer.css';

Modal.setAppElement('#root');

const NewCustomer = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [likeRestaurant, setLikeRestaurant] = useState(false);
    const navigate = useNavigate();
    const { setUserDetails } = useUser();

    useEffect(() => {
        fetchTables();
    }, []);


    const handleNameChange = (e) => {
        setCustomerName(e.target.value);
    };

    const handleRestaurantChange = (e) => {
        setSelectedRestaurant(e.target.value);
    };

    const handleLikeChange = (e) => {
        setLikeRestaurant(e.target.checked);
    };


    const fetchTables = async () => {
        try {
            const response = await axios.get('http://13.239.200.245:5000/api/tables');
            if (response.status === 200) {
                const sortedTables = response.data.sort((a, b) => {
                    return (a.tableNumber || 0) - (b.tableNumber || 0);
                });
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

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    const handleTableClick = (tableNumber) => {
        setSelectedTable(tableNumber);
        toast.success(`Table ${tableNumber} selected!`);
    };

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setMobileNumber(value);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTable) {
            toast.error('Please select a table!');
            return;
        }
        if (!customerName.trim()) {
            toast.error('Please enter your name!');
            return;
        }
        if (!mobileNumber || mobileNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number!');
            return;
        }
        if (!selectedRestaurant) {
            toast.error('Please select a restaurant!');
            return;
        }
        await sendOtp();
    };


    
    const sendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/sent-otp', { mobileNumber });
            if (response.status === 200) {
                toast.success('OTP sent successfully!');
                setOtpSent(true);
                setShowOtpModal(true);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response?.data?.message === 'User already exists') {
                toast.info('User already exists. Redirecting to regular customer page...');
                setTimeout(() => navigate('/regular-customer'), 2000);
            } else {
                toast.error('Unable to send OTP. Please try again later.');
            }
        }
    };

   

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
          toast.error('Please enter a valid 6-digit OTP!');
          return;
        }
        try {
          setIsVerifyingOtp(true);
          const otpResponse = await axios.post('http://localhost:5001/api/verify-otp', { mobileNumber, otp });
          if (otpResponse.status === 200) {
            const userDetails = {
              selectedTable,
              mobileNumber,
              userName: customerName,
              selectedRestaurant,
              likeRestaurant,
              orderStatus: 'pending',
            };
            const saveResponse = await axios.post('http://localhost:5001/orders/checkout', userDetails);
            if (saveResponse.status === 201) {
              const orderId = saveResponse.data.orderId;
              setUserDetails(userDetails);
              toast.success('Details saved successfully!');
              navigate(`/menu`);
            }
          }
        } catch (error) {
          console.error('Error:', error);
          if (error.response?.data?.message === 'User already exists') {
            toast.error('User already exists, Please Login as Regular Customer..');
          } else {
            toast.error('Failed to process request. Please try again.');
          }
        } finally {
          setIsVerifyingOtp(false);
          setShowOtpModal(false);
        }
      };
      
      



    return (
        <div className="booking-page">
            <div className="booking-container">
                <header className="booking-header">
                    <div className="restaurant-logo" style={{marginTop:"2rem"}}>
                        <span className="logo-text">W</span>
                    </div>
                    <h1>Welcome to Wazwan</h1>
                    <p className="header-subtitle">Select your table & begin your culinary journey</p>
                </header>

                <div className="booking-content">
                    <section className="tables-section">
                        <h2>Select Your Table</h2>
                        {loading ? (
                            <div className="modern-loader">
                                <div className="loader-spinner"></div>
                                <p>Loading tables...</p>
                            </div>
                        ) : (
                            <div className="modern-tables-grid">
                                {tables.map((table) => (
                                    <button
                                        key={table._id}
                                        className={`modern-table-card ${
                                            selectedTable === table.tableNumber ? 'selected' : ''
                                        } ${table.status.toLowerCase()}`}
                                        onClick={() => handleTableClick(table.tableNumber)}
                                        disabled={table.status !== 'Available'}
                                    >
                                        <div className="table-content">
                                            <span className="table-number">Table {table.tableNumber}</span>
                                            <span className="table-status">{table.status}</span>
                                        </div>
                                        <div className="selection-indicator"></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="contact-section">
                <h2>Enter Your Details</h2>
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="input-container">
                        <input
                            type="text"
                            value={customerName}
                            onChange={handleNameChange}
                            placeholder="Enter your name"
                            className="modern-input"
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="tel"
                            value={mobileNumber}
                            onChange={handleMobileChange}
                            placeholder="Enter mobile number"
                            className="modern-input"
                        />
                    </div>
                    <div className="input-container">
                        <select
                            value={selectedRestaurant}
                            onChange={handleRestaurantChange}
                            className="modern-select"
                        >
                            <option value="">Select a restaurant</option>
                            <option value="restaurant1">Wazwan Delights</option>
                            <option value="restaurant2">Kashmiri Flavors</option>
                            <option value="restaurant3">Himalayan Spice</option>
                        </select>
                    </div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="likeRestaurant"
                            checked={likeRestaurant}
                            onChange={handleLikeChange}
                            className="modern-checkbox"
                        />
                        <label htmlFor="likeRestaurant" className="checkbox-label">
                            Do you like our restaurant service?
                        </label>
                    </div>
                    <button type="submit" className="modern-submit-btn">
                        Confirm Details
                    </button>
                </form>
            </section>
                </div>
            </div>

            <Modal
                isOpen={showOtpModal}
                onRequestClose={() => setShowOtpModal(false)}
                className="modern-modal"
                overlayClassName="modern-modal-overlay"
            >
                <div className="modal-header">
                    <h2>Verify OTP</h2>
                    <p>Enter the 6-digit code sent to {mobileNumber}</p>
                </div>
                <div className="modal-body">
                    <input
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter OTP"
                        className="modern-otp-input"
                    />
                    <div className="modal-actions">
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="modal-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp}
                            className="modal-verify-btn"
                        >
                            {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default NewCustomer;