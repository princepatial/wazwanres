import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import './Wallet.css';

const MetaMaskConnect = ({ onConnect }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  };

  const connectToMetaMask = async () => {
    if (isMetaMaskInstalled) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]);
        toast.success('Connected to MetaMask successfully!');
        onConnect(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
        toast.error('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      toast.error('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const disconnectMetaMask = () => {
    setIsConnected(false);
    setAccount(null);
    toast.info('Disconnected from MetaMask.');
    onConnect(null);
  };

  return (
    <div className="metamask-connect-container">
      {!isMetaMaskInstalled ? (
        <p className="metamask-not-installed">
          MetaMask is not installed. Please install it to use this feature.
        </p>
      ) : isConnected ? (
        <div className="metamask-connected">
          <p className="connected-account">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button className="metamask-disconnect-btn" onClick={disconnectMetaMask}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="metamask-connect-btn" onClick={connectToMetaMask}>
          <WalletIcon size={20} />
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
