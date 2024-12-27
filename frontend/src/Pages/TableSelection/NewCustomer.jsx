import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'; // Importing Modal
import './NewCustomer.css';

Modal.setAppElement('#root'); // To bind the modal to the root element for accessibility

const NewCustomer = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://51.20.97.10/api/tables');
        if (response.status === 200) {
          const sortedTables = response.data.tables.sort((a, b) => {
            const numA = parseInt(a.name, 10);
            const numB = parseInt(b.name, 10);
            return numA - numB;
          });
          setTables(sortedTables);
        } else {
          throw new Error('Failed to fetch tables');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tables:', error);
        toast.error('Unable to fetch tables. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchTables();
  }, []);  
  

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    toast.success(`${tableName} selected!`);
  };

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      toast.error('Please select a table!');
      return;
    }

    if (!mobileNumber || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number!');
      return;
    }

    try {
      const response = await axios.get('http://51.20.97.10/orders');
      if (response.status === 200) {
        const existingNumbers = response.data.orders.map((order) => order.mobileNumber);
        if (existingNumbers.includes(mobileNumber)) {
          toast.error('You are a regular customer. Please try with a new number!');
        } else {
          // Send OTP request here
          await sendOtp();
        }
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Unable to validate mobile number. Please try again later.');
    }
  };

  const sendOtp = async () => {
    try {
      // Send OTP to mobile number
      const response = await axios.post('http://51.20.97.10/api/sent-otp', { mobileNumber });
      if (response.status === 200) {
        toast.success('OTP sent successfully!');
        setOtpSent(true);
        setShowOtpModal(true);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Unable to send OTP. Please try again later.');
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid OTP!');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const response = await axios.post('http://51.20.97.10/api/verify-otp', { mobileNumber, otp });
      if (response.status === 200) {
        localStorage.setItem('selectedTable', selectedTable);
        localStorage.setItem('mobileNumber', mobileNumber);
        toast.success('OTP verified successfully!');
        setShowOtpModal(false);
        setTimeout(() => navigate('/menu'), 1000);
      } else {
        toast.error('Invalid OTP!');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Failed to verify OTP. Please try again later.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="new-customer-page">
      <div className="content-wrapper1">
        <header className="page-header">
          <h1>Welcome to Wazwan Legacy</h1>
          <p>Embark on a Culinary Journey</p>
        </header>

        <div className="reservation-container">
          <div className="table-selection">
            <h2>
              Select Your Table <span className="mandatory">*</span>
            </h2>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <div className="tables-grid">
                {tables.map((table) => (
                  <button
                    key={table._id}
                    className={`table-button ${selectedTable === table.name ? 'selected' : ''} ${table.status}`}
                    onClick={() => handleTableClick(table.name)}
                    disabled={table.status !== 'available'}
                    style={{
                      backgroundColor: table.status === 'unavailable' ? '#d3d3d3' : '',
                      cursor: table.status !== 'available' ? 'not-allowed' : 'pointer',
                      border: table.status === 'unavailable' ? '2px solid red' : '',
                      opacity: table.status === 'unavailable' ? 0.5 : 1,
                    }}
                  >
                    {table.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-input-section">
            <h2>
              Your Contact <span className="mandatory">*</span>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  required
                  value={mobileNumber}
                  onChange={handleMobileChange}
                />
              </div>
              <button id="submit-button" type="submit">
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal isOpen={showOtpModal} onRequestClose={() => setShowOtpModal(false)} contentLabel="OTP Modal" className="otp-modal">
        <h2>Enter OTP</h2>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          className="otp-input"
        />
        <button
          onClick={handleVerifyOtp}
          disabled={isVerifyingOtp}
          className={`verify-button ${isVerifyingOtp ? 'loading' : ''}`}
        >
          {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
        </button>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default NewCustomer;
