import React, { useState, useEffect } from 'react';
import { useCart } from '../Cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ShoppingBag, Plus, Minus, Search,  Lock  } from 'lucide-react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Menu.css';
import { useUser } from '../../Components/Profile/UserContext'; // Assuming this provides login status

const Menu = () => {
  const { userDetails } = useUser(); // Access userDetails to check login status
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cart = [], removeFromCart, updateCartItemQuantity } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://13.239.200.245:5000/api/products');
        setMenuItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        toast.error('Failed to fetch menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAddToCart = (item) => {
    if (!userDetails) {
      toast.error('Please log in to add items to the cart');
      return;
    }

    addToCart({
      id: item._id,
      name: item.itemName,
      price: item.sellPrice,
      image: item.imageUrl || '/default-image.jpg',
      imageUrl: item.imageUrl || '/default-image.jpg',
    });
    setAddedItems((prev) => ({ ...prev, [item._id]: true }));
    toast.success(`Added ${item.itemName}`);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item._id]: false }));
    }, 1000);
  };

  const handleQuantityChange = (item, change) => {
    if (!userDetails) {
      toast.error('Please log in to modify the cart');
      return;
    }

    const cartItem = cart.find((cartItem) => cartItem.id === item._id);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity > 0) {
        updateCartItemQuantity(item._id, newQuantity);
      } else {
        removeFromCart(item._id);
        toast.info(`Removed ${item.itemName}`);
      }
    } else if (change > 0) {
      handleAddToCart(item);
    }
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setSearchTerm('');
    if (filter === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.type.toLowerCase() === filter));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setActiveFilter('all');

    if (term === '') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) =>
        item.itemName.toLowerCase().includes(term)
      ));
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="menu-modern">
      <div className={`menu-header ${isHeaderVisible ? 'visible' : 'hidden'}`} style={{ marginTop: "7rem" }}>
        <div className="brand-section">
          <h1 className="brand-name">
            Wazwan <span>Restaurants</span>
          </h1>
          <p className="brand-tagline">Discover Culinary Excellence</p>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <nav className="category-nav">
        {['all', 'veg', 'non-veg', 'beverage', 'starters', 'bread'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className={`category-btn ${activeFilter === filter ? 'active' : ''}`}
            style={{
              backgroundColor:
                activeFilter === filter
                  ? filter === 'veg' ? '#008000'
                    : filter === 'non-veg' ? 'red'
                      : filter === 'beverage' ? 'blue'
                        : filter === 'starters' ? 'orange'
                          : filter === 'bread' ? 'brown'
                            : '#273746 '
                  : '',
              color: activeFilter === filter ? '#fff' : '',
            }}
          >
            {filter
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </button>
        ))}
      </nav>

      <div className="menu-grid">
        {filteredItems.map((item) => {
          const cartItem = cart.find((cartItem) => cartItem.id === item._id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={item._id} className="menu-card">
              <div className="card-media">
                <img
                  src={item.imageUrl || '/default-image.jpg'}
                  alt={item.itemName}
                  loading="lazy"
                />
                <span className="item-badge">{item.type}</span>
              </div>

              <div className="card-content">
                <h3>{item.itemName}</h3>
                <div className="price-tag">₹{item.sellPrice}</div>

                <div className="card-actions">
                  {quantity > 0 ? (
                    <div className="quantity-adjuster">
                      <button onClick={() => handleQuantityChange(item, -1)} disabled={!userDetails}>
                        <Minus size={16} />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => handleQuantityChange(item, 1)} disabled={!userDetails}>
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                    className={`add-to-cart ${addedItems[item._id] ? 'added' : ''}`}
                    onClick={() => handleAddToCart(item)}
                    disabled={!userDetails}
                    title={!userDetails ? "Log in to add items to the cart" : ""}
                  >
                    {userDetails ? <Plus size={16} /> : <Lock size={16} />}
                    <span>Add</span>
                  </button>

                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <button className="floating-cart" onClick={() => navigate('/checkout')}>
          <ShoppingBag size={20} />
          <span className="cart-items">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          <span className="cart-label">View Cart</span>
        </button>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Menu;
