import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { ethers } from 'ethers';
import {
    ShoppingCart,
    Minus,
    Plus,
    Trash2,
    CheckCircle,
    User,
    PlusCircle,
    ArrowRight,
    CreditCard,
    Clock,
    Wallet,
    X,
    Loader,
    AlertCircle
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';

const SuggestedItems = ({ onAddToCart }) => {
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestedItems = async () => {
            try {
                const response = await axios.get('http://51.20.97.10/api/products');
                const randomItems = response.data
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
                setSuggestedItems(randomItems);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch suggested items:', error);
                setLoading(false);
            }
        };

        fetchSuggestedItems();
    }, []);
    

    if (loading) {
        return <div className="suggested-items-loading">Loading suggestions...</div>;
    }

    
    return (
        <div className="suggested-items-section">
            <div className="suggested-items-header">
                <h3>Add More Items</h3>
                <p>You might also like these</p>
            </div>
            <div className="suggested-items-grid">
                {suggestedItems.map((item) => (
                    <div key={item._id} className="suggested-item-card">
                        <div className="suggested-item-image-wrapper">
                            <img
                                src={item.imageUrl || '/default-image.jpg'}
                                alt={item.itemName}
                                className="suggested-item-image"
                            />
                        </div>
                        <div className="suggested-item-details">
                            <h4>{item.itemName}</h4>
                            <p className="suggested-item-price">₹{item.sellPrice}</p>
                            <button
                                onClick={() => onAddToCart({
                                    id: item._id,
                                    name: item.itemName,
                                    price: item.sellPrice,
                                    imageUrl: item.imageUrl || '/default-image.jpg'
                                })}
                                className="suggested-item-add-btn"
                            >
                                <PlusCircle size={16} />
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Cart = () => {
    const {
        cart: cartItems,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToCart
    } = useCart();

    const [isModalOpen, setModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [showWalletOptions, setShowWalletOptions] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const navigate = useNavigate();

    const convertToEth = (amountInINR) => {
        const ethPrice = 200000; // Mock exchange rate
        return Number((amountInINR / ethPrice).toFixed(6));
    };

    const connectToMetamask = async () => {
        try {
            setTransactionStatus('connecting');
            setPaymentError('');

            if (!window.ethereum) {
                throw new Error('MetaMask is not installed! Please install MetaMask to continue.');
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const web3Signer = web3Provider.getSigner();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setWalletAddress(accounts[0]);

            const balance = await web3Provider.getBalance(accounts[0]);
            setWalletBalance(parseFloat(ethers.utils.formatEther(balance)));

            setWalletConnected(true);
            setTransactionStatus('connected');
            toast.success('Connected to MetaMask successfully!');

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return true;
        } catch (error) {
            setTransactionStatus('error');
            setPaymentError(error.message);
            toast.error(`Failed to connect to MetaMask: ${error.message}`);
            return false;
        }
    };

    const handlePaymentOption = async (option) => {
        if (option === 'now') {
            try {
                // Calculate final amount with discount if applicable
                const finalPaymentAmount = (localStorage.getItem('mobileNumber') ? finalAmount * 0.9 : finalAmount) * 100;
    
                const options = {
                    key: "rzp_test_TPSxbkBGCLvVAq",
                    amount: finalPaymentAmount,
                    currency: "INR",
                    name: "wazwan",
                    description: "Food Order Payment",
                    prefill: {
                        name: userName || '',
                        contact: localStorage.getItem('mobileNumber') || ''
                    },
                    handler: async function (response) {
                        try {
                            await processOrder({
                                transactionId: response.razorpay_payment_id,
                                paymentMethod: 'razorpay',
                                status: 'success',
                                amount: finalPaymentAmount / 100
                            });
                            
                            toast.success('Payment successful!');
                            setModalOpen(false);
                        } catch (error) {
                            toast.error('Failed to process order after payment');
                            console.error('Order processing error:', error);
                        }
                    },
                    modal: {
                        ondismiss: function() {
                            toast.info('Payment cancelled');
                        }
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };
    
                const razorpayInstance = new window.Razorpay(options);
                
                razorpayInstance.on('payment.failed', function (response) {
                    toast.error(`Payment failed: ${response.error.description}`);
                    console.error('Payment failed:', response.error);
                });
    
                razorpayInstance.open();
    
            } catch (error) {
                toast.error('Failed to initialize payment. Please try again.');
                console.error('Payment initialization error:', error);
            }
        } else if (option === 'later') {
            try {
                await processOrder({ 
                    paymentMethod: 'cash', 
                    status: 'pending',
                    amount: finalAmount
                });
                toast.success('Order placed successfully! Please pay at the counter.');
                setModalOpen(false);
            } catch (error) {
                toast.error('Failed to place order');
                console.error('Cash order error:', error);
            }
        }
    };
    
    // Make sure this useEffect is in your component
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            setWalletConnected(false);
            setWalletAddress('');
            setWalletBalance(0);
            setTransactionStatus('');
            toast.info('Wallet disconnected');
        } else {
            setWalletAddress(accounts[0]);
            const balance = await provider.getBalance(accounts[0]);
            setWalletBalance(parseFloat(ethers.utils.formatEther(balance)));
            toast.info('Account changed');
        }
    };

    const handleWalletPayment = async () => {
        try {
            setPaymentInProgress(true);
            setPaymentError('');
            setTransactionStatus('processing');

            if (!signer || !walletAddress) {
                throw new Error('Wallet not connected. Please connect your wallet first.');
            }

            const amountInEth = convertToEth(finalAmount);
            const amountInWei = ethers.utils.parseEther(amountInEth.toString());

            const balance = await provider.getBalance(walletAddress);
            if (balance.lt(amountInWei)) {
                throw new Error(`Insufficient balance. You need ${amountInEth} ETH but have ${ethers.utils.formatEther(balance)} ETH`);
            }

            const gasPrice = await provider.getGasPrice();
            const gasLimit = await provider.estimateGas({
                to: "0x149564Eba9d4E5724B72d4010B2aE8ea18F21cd3",
                value: amountInWei
            });

            const transaction = {
                to: "0x149564Eba9d4E5724B72d4010B2aE8ea18F21cd3",
                value: amountInWei,
                gasPrice: gasPrice,
                gasLimit: gasLimit
            };

            const tx = await signer.sendTransaction(transaction);
            setTransactionStatus('confirming');
            setTransactionHash(tx.hash);

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                setTransactionStatus('success');
                toast.success('Payment successful! Processing your order...');

                const newBalance = await provider.getBalance(walletAddress);
                setWalletBalance(parseFloat(ethers.utils.formatEther(newBalance)));

                await processOrder({
                    transactionHash: receipt.transactionHash,
                    paymentMethod: 'ethereum',
                    amountPaid: amountInEth,
                    walletAddress: walletAddress
                });

                setSelectedWallet(null);
                setShowWalletOptions(false);
                setModalOpen(false);
            } else {
                throw new Error('Transaction failed.');
            }

        } catch (error) {
            setTransactionStatus('error');
            setPaymentError(error.message);
            toast.error(`Payment failed: ${error.message}`);
        } finally {
            setPaymentInProgress(false);
        }
    };

    const processOrder = async (paymentDetails = {}) => {
        const selectedTable = localStorage.getItem('selectedTable');
        const mobileNumber = localStorage.getItem('mobileNumber');

        if (mobileNumber && !userName.trim()) {
            toast.error('Please enter your name to place the order.');
            return;
        }

        if (!selectedTable) {
            toast.error('Table number is missing!');
            return;
        }

        const orderItems = cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        let discountedAmount = finalAmount;
        if (mobileNumber) {
            discountedAmount = finalAmount * 0.9;
        }

        try {
            const response = await axios.post('http://51.20.97.10/orders/checkout', {
                items: orderItems,
                selectedTable,
                mobileNumber: mobileNumber || '',
                userName: mobileNumber ? userName : '',
                totalAmount: discountedAmount.toFixed(2),
                paymentDetails: {
                    ...paymentDetails,
                    amount: discountedAmount,
                    currency: 'ETH'
                }
            });

            if (response.data.success) {
                toast.success('Order placed successfully!');
                localStorage.removeItem('selectedTable');
                localStorage.removeItem('mobileNumber');
                navigate(`/order-success/${response.data.orderId}`);
                clearCart();
            } else {
                throw new Error(response.data.message || 'Failed to place the order.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('An error occurred while placing the order. Please try again.');
            throw error;
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const gst = cartTotal * 0.05;
    const finalAmount = cartTotal + gst;

    if (cartItems.length === 0) {
        return (
            <div className="cart-container-empty">
                <ShoppingCart size={64} className="empty-cart-icon" />
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/menu" className="explore-menu-btn">
                    Explore Menu
                </Link>
                <ToastContainer />
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <div className="cart-main-content">
                <div className="cart-container">
                    <div className="cart-header">
                        <ShoppingCart size={32} />
                        <h2>Your Cart</h2>
                    </div>

                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <div className="cart-item-image-wrapper">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-price">₹{item.price}</p>
                                    <div className="quantity-control-modern">
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="item-total">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        className="remove-item-btn"
                                        onClick={() => {
                                            removeFromCart(item.id);
                                            toast.info('Item removed from cart.');
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-modern">
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <h3>₹{cartTotal.toFixed(2)}</h3>
                            </div>
                            <div className="summary-row">
                                <span>GST (5%)</span>
                                <h3>₹{gst.toFixed(2)}</h3>
                            </div>
                            {localStorage.getItem('mobileNumber') && (
                                <div className="summary-row">
                                    <span>Discount (10%)</span>
                                    <h3>-₹{(finalAmount * 0.1).toFixed(2)}</h3>
                                </div>
                            )}
                            <div className="summary-row total-row">
                                <span>Total Amount</span>
                                <h3 className="total-with-gst">₹{(localStorage.getItem('mobileNumber') ? (finalAmount * 0.9).toFixed(2) : finalAmount.toFixed(2))}</h3>
                            </div>
                        </div>
                        <button
                            className="checkout-btn-modern"
                            onClick={() => setModalOpen(true)}
                        >
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="suggested-items-sidebar">
                <SuggestedItems onAddToCart={(item) => {
                    addToCart(item);
                    toast.success(`${item.name} added to cart!`);
                }} />
            </div>

            {isModalOpen && (
                <div className="checkout-modal-overlay">
                    <div className="checkout-modal">
                        <div className="modal-header">
                            <h2>Confirm Your Order</h2>
                            <button
                                className="modal-close-btn"
                                onClick={() => setModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-order-summary">
                            {cartItems.map((item) => (
                                <div key={item.id} className="modal-order-item">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="modal-item-image"
                                    />
                                    <div className="modal-item-details">
                                        <h4>{item.name}</h4>
                                        <p>
                                            {item.quantity} × ₹{item.price} =
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-total-section">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <h3>₹{cartTotal.toFixed(2)}</h3>
                            </div>
                            <div className="summary-row">
                                <span>GST (5%)</span>
                                <h3>₹{gst.toFixed(2)}</h3>
                            </div>
                            {localStorage.getItem('mobileNumber') && (
                                <div className="summary-row">
                                    <span>Discount (10%)</span>
                                    <h3>-₹{(finalAmount * 0.1).toFixed(2)}</h3>
                                </div>
                            )}
                            <div className="summary-row total-row">
                                <span>Total Amount</span>
                                <h3 className="total-with-gst">₹{(localStorage.getItem('mobileNumber') ? (finalAmount * 0.9).toFixed(2) : finalAmount.toFixed(2))}</h3>
                            </div>
                        </div>

                        {localStorage.getItem('mobileNumber') && (
                            <div className="modal-input-section">
                                <div className="input-wrapper">
                                    <User size={20} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Your Name *"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!showPaymentOptions ? (
                            <button
                                className="place-order-btn"
                                onClick={() => setShowPaymentOptions(true)}
                            >
                                <CheckCircle size={20} />
                                Place Order
                            </button>
                        ) : (
                            <div className="payment-options">
                                <h3>Choose Payment Option</h3>
                                <div className="payment-buttons">
                                    <button
                                        className="payment-btn pay-now"
                                        onClick={() => handlePaymentOption('now')}
                                    >
                                        <CreditCard size={20} />
                                        Pay Now
                                    </button>
                                    <button
                                        className="payment-btn pay-later"
                                        onClick={() => handlePaymentOption('later')}
                                    >
                                        <Clock size={20} />
                                        Pay Later
                                    </button>
                                    <button
                                        className="payment-btn pay-wallet"
                                        onClick={() => {
                                            setShowWalletOptions(true);
                                            connectToMetamask();
                                        }}
                                    >
                                        <Wallet size={20} />
                                        Pay with Wallet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showWalletOptions && (
                <div className="wallet-modal-overlay">
                    <div className="wallet-modal">
                        <button
                            className="close-modal"
                            onClick={() => {
                                setShowWalletOptions(false);
                                setTransactionStatus('');
                                setPaymentError('');
                            }}
                        >
                            <X size={24} />
                        </button>
                        <h2>Crypto Payment</h2>

                        {!walletConnected ? (
                            <>
                                <p className="wallet-description">
                                    Connect your wallet to pay with cryptocurrency
                                </p>
                                <div className="wallet-options">
                                    <button
                                        className="wallet-option metamask"
                                        onClick={connectToMetamask}
                                        disabled={paymentInProgress}
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/330px-MetaMask_Fox.svg.png" alt="Metamask" />
                                        MetaMask
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="wallet-info">
                                <div className="wallet-status">
                                    <div className="wallet-address">
                                        Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                    </div>
                                    <div className="wallet-balance">
                                        Balance: {walletBalance.toFixed(4)} ETH
                                    </div>
                                </div>

                                <div className="payment-amount">
                                    <h3>Payment Details</h3>
                                    <div className="amount-details">
                                        <p>Amount in INR: ₹{finalAmount.toFixed(2)}</p>
                                        <p>Amount in ETH: {convertToEth(finalAmount)} ETH</p>
                                    </div>
                                </div>

                                {paymentError && (
                                    <div className="error-message">
                                        <AlertCircle size={16} />
                                        {paymentError}
                                    </div>
                                )}

                                {transactionHash && (
                                    <div className="transaction-hash">
                                        Transaction Hash:
                                        <a
                                            href={`https://etherscan.io/tx/${transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                                        </a>
                                    </div>
                                )}

                                <button
                                    className={`pay-with-wallet-btn ${paymentInProgress ? 'processing' : ''}`}
                                    onClick={handleWalletPayment}
                                    disabled={paymentInProgress}
                                >
                                    {paymentInProgress ? (
                                        <>
                                            <Loader className="spinner" size={20} />
                                            {transactionStatus === 'processing' && 'Processing Payment...'}
                                            {transactionStatus === 'confirming' && 'Confirming Transaction...'}
                                        </>
                                    ) : (
                                        <>
                                            <Wallet size={20} />
                                            Pay {convertToEth(finalAmount)} ETH
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Cart;
