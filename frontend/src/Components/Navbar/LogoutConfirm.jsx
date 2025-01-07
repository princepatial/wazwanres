import React, { useEffect } from 'react';
import './LogoutConfirm.css';

const LogoutConfirm = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="logout-modal-container">
      <div className="logout-modal-overlay" onClick={onCancel}></div>
      <div className="logout-modal">
        <div className="logout-modal-content">
          <h3>Are you sure you want to logout?</h3>
          <div className="logout-modal-buttons">
            <button className="confirm-btn" onClick={onConfirm}>Yes</button>
            <button className="cancel-btn" onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirm;