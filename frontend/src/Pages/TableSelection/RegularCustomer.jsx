import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './RegularCustomer.css';

const RegularCustomer = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://13.239.200.245:5000/api/tables');
       
        if (response.status === 200) {
          const tablesData = response.data;

          // Sort by tableNumber instead of name
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


  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
    toast.success(`Table ${tableNumber} selected!`);

    localStorage.setItem('selectedTable', tableNumber.toString());
    setTimeout(() => {
      navigate('/menu');
    }, 1000);
  };

  return (
    <div className="rc-regular-customer-page" >
      <div className="rc-content-wrapper">
        <header className="rc-page-header">
          <h1>Welcome Back to Wazwan Restaurants</h1>
          <p>We’re excited to serve you again!</p>
        </header>

        <div className="rc-reservation-container">
          <div className="rc-table-selection">
            <h2>Select Your Table <span className="mandatory">*</span>
            </h2>
            {loading ? (
              <div className="rc-loading-spinner"></div>
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
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default RegularCustomer;
