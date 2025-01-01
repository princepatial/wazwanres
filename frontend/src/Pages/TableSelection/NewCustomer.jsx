import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get('http://13.239.200.245:5000/api/tables');


                if (response.status === 200) {
                    const tablesData = response.data;

                    // Sort by tableNumber
                    const sortedTables = tablesData.sort((a, b) => {
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

        fetchTables();
    }, []);

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleTableClick = (tableNumber) => {
        setSelectedTable(tableNumber);
        toast.success(`Table ${tableNumber} selected!`);
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

        await sendOtp();
    };

    const sendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/sent-otp', { mobileNumber });
            if (response.status === 200) {
                toast.success('OTP sent successfully!');
                setOtpSent(true);
                setShowOtpModal(true);
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response && error.response.data) {
                if (error.response.data.message === 'User already exists') {
                    toast.info('User already exists. Redirecting to regular customer page...');
                    setTimeout(() => {
                        navigate('/regular-customer');
                    }, 2000); 
                } else {
                    toast.error('Unable to send OTP. Please try again later.');
                }
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
            const response = await axios.post('http://localhost:5001/api/verify-otp', { mobileNumber, otp });
            if (response.status === 200) {
                localStorage.setItem('selectedTable', selectedTable.toString());
                localStorage.setItem('mobileNumber', mobileNumber);
                toast.success('OTP verified successfully!');
                setShowOtpModal(false);
                setTimeout(() => navigate('/menu'), 1000);
            } else {
                toast.error('Invalid OTP!');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.response && error.response.data) {
                if (error.response.data.message === 'User already exists') {
                    toast.info('User already exists. Redirecting to regular customer page...');
                    setTimeout(() => {
                        navigate('/regular-customer');
                    }, 2000); 
                } else {
                    toast.error('OTP verification failed. Please try again.');
                }
            } else {
                toast.error('OTP verification failed. Please try again.');
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    return (
        <div className="new-customer-page">
            <div className="content-wrapper1">
                <header className="page-header">
                    <h1>Welcome to Wazwan Restaurants</h1>
                </header>

                <div className="reservation-container">
                    <div className="table-selection">
                        <h2>
                            Select Your Table <span className="mandatory">*</span>
                        </h2>
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <div className="rc-tables-grid">
                                {tables.length > 0 ? (
                                    tables.map((table) => (
                                        <button
                                            key={table._id}
                                            className={`table-button ${selectedTable === table.tableNumber ? 'selected' : ''
                                                } ${table.status.toLowerCase()}`}
                                            onClick={() => handleTableClick(table.tableNumber)}
                                            disabled={table.status !== 'Available'}
                                            style={{
                                                backgroundColor: table.status !== 'Available' ? '#d3d3d3' : '',
                                                cursor: table.status !== 'Available' ? 'not-allowed' : 'pointer',
                                                border: table.status !== 'Available' ? '2px solid red' : '',
                                                opacity: table.status !== 'Available' ? 0.5 : 1,
                                            }}
                                        >
                                            Table {table.tableNumber}
                                        </button>
                                    ))
                                ) : (
                                    <div className="no-tables-message">
                                        No tables available at the moment. Please try again later.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mobile-input-section">
                        <h2>
                         Enter Your Contact <span className="mandatory">*</span>
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
                                Confirm Number
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
