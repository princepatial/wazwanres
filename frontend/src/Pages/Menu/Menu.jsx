import React, { useState, useEffect } from 'react';
import { useCart } from '../Cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ShoppingBag, Plus, Minus, Search, Lock } from 'lucide-react';
import Modal from '../Home/Modal';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Menu.css';
import { useUser } from '../../Components/Profile/UserContext';
import VariantSelectionModal from './VariantSelectionModal';

const Menu = () => {
  const { userDetails } = useUser();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cart = [], removeFromCart, updateCartItemQuantity } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);


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
    console.log("isModalVisible:", isModalVisible);
  }, [isModalVisible]);

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

  const handleAddToCart = (item, selectedVariant = null) => {
    if (!userDetails) {
      toast.error('Please log in to add items to the cart');
      setIsModalVisible(true);
      return;
    }

    if (item.variants && item.variants.length > 0 && !selectedVariant) {
      setSelectedProduct(item);
      setIsVariantModalOpen(true);
      return;
    }


    const itemToAdd = {
      id: item._id,
      name: item.itemName,
      price: selectedVariant ? selectedVariant.price : item.basePrice,
      image: item.imageUrl || '/default-image.jpg',
      imageUrl: item.imageUrl || '/default-image.jpg',
      variant: selectedVariant ? selectedVariant.name : null,
      variantName: selectedVariant ? `(${selectedVariant.name})` : '',
    };

    addToCart(itemToAdd);
    setAddedItems((prev) => ({ ...prev, [item._id]: true }));
    toast.success(`Added ${item.itemName} ${itemToAdd.variantName}`);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item._id]: false }));
    }, 1000);
  };



  const getBasePrice = (item) => {
    if (!item.variants || item.variants.length === 0) {
      return item.basePrice;
    }

    const lowestPrice = Math.min(...item.variants.map(v => v.price));
    return lowestPrice;
  };


  const handleVariantSelect = (variant) => {
    if (selectedProduct) {
      handleAddToCart(selectedProduct, variant);
    }
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
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



  console.log(userDetails);
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setSearchTerm('');
    if (filter === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => 
        // Case-insensitive comparison and handle variations in naming
        item.type.toLowerCase() === filter.toLowerCase() ||
        item.type.toLowerCase().replace('-', ' ') === filter.toLowerCase().replace('-', ' ')
      ));
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
  {['all', 'Beverage', 'Starter', 'Dessert', 'Breads', 'Main Course', 'Combo', 'Sweets', 'Snacks'].map((filter) => (
    <button
      key={filter}
      onClick={() => handleFilter(filter)}
      className={`category-btn ${activeFilter === filter ? 'active' : ''}`}
      style={{
        backgroundColor:
          activeFilter === filter
            ? filter === 'all' ? '#273746'
            : filter === 'Beverage' ? '#20B2AA'    // Light Sea Green
            : filter === 'Starter' ? '#FF6B6B'     // Coral Red
            : filter === 'Dessert' ? '#9370DB'     // Medium Purple
            : filter === 'Breads' ? '#F4A460'      // Sandy Brown
            : filter === 'Main Course' ? '#4682B4'  // Steel Blue
            : filter === 'Combo' ? '#2E8B57'       // Sea Green
            : filter === 'Sweets' ? '#FF69B4'      // Hot Pink
            : filter === 'Snacks' ? '#FFA500'      // Orange
            : '#273746'
            : '',
        color: activeFilter === filter ? '#fff' : '',
      }}
    >
      {filter === 'all' ? 'All Items' : filter}
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

                <div className="price-tag">
                  <span className="base-price">₹{getBasePrice(item)}</span>
                  {item.variants && item.variants.length > 0 && (
                    <span className="onwards-text">onwards</span>
                  )}
                </div>

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
                      // disabled={!userDetails}
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

      {isModalVisible && <Modal onClose={() => setIsModalVisible(false)} />}
      <VariantSelectionModal
        isOpen={isVariantModalOpen}
        onClose={() => {
          -
            setIsVariantModalOpen(false);
          setSelectedProduct(null);
        }}
        variants={selectedProduct?.variants || []}
        onVariantSelect={handleVariantSelect}
        itemName={selectedProduct?.itemName}
      />
    </div>
  );
};

export default Menu;
