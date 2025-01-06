import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../Components/Profile/UserContext';
import { useCart } from './CartContext';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  CreditCard,
  Clock,
  X
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
        const response = await axios.get('http://13.239.200.245:5000/api/products');
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

  const { userDetails } = useUser();
  const { mobileNumber, selectedTable } = userDetails;
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [hasExistingOrder, setHasExistingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      navigate('/');
    } else {
      checkExistingOrder();
    }
  }, [userDetails, navigate]);

  const checkExistingOrder = async () => {
    try {
      const orderResponse = await axios.get(`http://localhost:5001/orders/${mobileNumber}`);
      if (orderResponse.data.success && orderResponse.data.orders.length > 0) {
        setHasExistingOrder(true);
        setDiscount(0); // No discount for existing customers
      } else {
        setHasExistingOrder(false);
        setDiscount(0.1); // 10% discount for new customers
        toast.success('You have a 10% discount on your first order!');
      }
    } catch (error) {
      console.error('Error checking existing order:', error);
      setHasExistingOrder(false);
      setDiscount(0.1); // Assume 10% discount if there's an error
    }
  };



  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!userDetails) {
    return null;
  }

  console.log("suerdetails", userDetails);

  const handlePaymentOption = async (option) => {
    if (option === 'now') {
      try {
        const finalPaymentAmount = finalAmount * 100;

        const options = {
          key: "rzp_test_TPSxbkBGCLvVAq",
          amount: finalPaymentAmount,
          currency: "INR",
          name: "wazwan",
          description: "Food Order Payment",
          prefill: {
            contact: mobileNumber || ''
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
            ondismiss: function () {
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

  const processOrder = async (paymentDetails = {}) => {
    if (!selectedTable || !mobileNumber) {
      toast.error('Table number or mobile number is missing!');
      return;
    }

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const numericAmount = parseFloat(finalAmount.toFixed(2));

    try {
      const response = await axios.post(`http://localhost:5001/orders/checkout/${mobileNumber}`, {
        items: orderItems,
        selectedTable,
        mobileNumber,
        totalAmount: numericAmount,
        paymentDetails: {
          paymentMethod: paymentDetails.paymentMethod,
          status: paymentDetails.status,
          amount: paymentDetails.amount,
          transactionId: paymentDetails.transactionId || null // Only present for Razorpay payments
        }
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
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
  const discountAmount = hasExistingOrder ? 0 : cartTotal * discount;
  const gstAmount = cartTotal * 0.05;
  const finalAmount = cartTotal - discountAmount + gstAmount;

  if (cartItems.length === 0) {
    return (
      <div className="wrapper">
        <div className="cart-container-empty">
          <ShoppingCart size={64} className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/menu" className="explore-menu-btn">
            Explore Menu
          </Link>
          <ToastContainer />
        </div>
      </div>

    );
  }

  return (
    <div className="cart-page-container" style={{ marginTop: "3rem" }}>
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
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>

              {!hasExistingOrder && discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount (10%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total Amount</span>
                <h3 className="total-with-gst">₹{finalAmount.toFixed(2)}</h3>
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
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>

              {!hasExistingOrder && discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount (10%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total Amount</span>
                <h3 className="total-with-gst">₹{finalAmount.toFixed(2)}</h3>
              </div>
            </div>


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
                </div>
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