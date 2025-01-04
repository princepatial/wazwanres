import React, { useState, useEffect } from 'react';
import { MessageSquare, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Components/Profile/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Modal from './Modal';
import './Home.css';


const testimonials = [
  {
    quote: "The food here is awesome especially kashmiri cuisine. I had visited this place twice was able to explore chicken Lara, chicken katni both dishes had kashmiri flavour. Strongly recommend you to try here",
    author: "K Pavan",
    title: "Dine in",
    image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    quote: "Amazing food n taste especially kashmiri wazwan was authentic n was served in  typical kashmiri style....",
    author: "tawseef war",
    title: "Dine in",
    image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    quote: "I had a very awesome experience at wazwan",
    author: "Dani Guandeh",
    title: "Regular Customer",
    image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    quote: "I liked the flavours  they have added not just common flavours in chicken dishes its different ,service was fast  didnt have to wait much,a bit pricey for a single person , they should introduce some menu for a single person as that much of quantity  a single person cannot eat and it goes on waste, anyhow 5 stars for taste",
    author: "Nirmal Singh",
    title: "Food Blogger",
    image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    quote: "Amazing taste that u never ever get anywhere in the tricity. Must try the mouth watering taste of Kashmiri and Mughlai foods.",
    author: "Director Outreach",
    title: "Dine in",
    image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
  }
];


const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { userDetails } = useUser();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const handleOrderClick = () => {
    if (!userDetails) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };



  const foodCards = [
    { id: 1, title: '', img: '/tiles.jpg' },
    { id: 2, title: '', img: '/tiles.jpg' },
    { id: 3, title: '', img: '/tiles.jpg' },
    { id: 4, title: '', img: '/tiles.jpg' }
  ];

  return (
    <div className="luxury-food-home">
      <div className="hero-section">
        <div className="gradient-overlay" />
        <div className="pattern-overlay" />
        <motion.div
          className="content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="left-content">
            <motion.div
              className="title-container"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="decorator-line" />
              <h1 className="main-title">
                Discover the Art of <br />
                <span className="highlight">Kashmiri Cuisine</span>
              </h1>
            </motion.div>

            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Indulge in the opulent flavors of Kashmiri Wazwan. A centuries-old
              culinary tradition, now at your fingertips.
            </motion.p>

            <motion.div
              className="explore-menu-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <button
                className={`explore-menu-button ${userDetails ? 'disabled' : ''}`}
                onClick={handleOrderClick}
                disabled={userDetails}
              >
                <span className="button-text">
                  {userDetails ? 'Already Logged In,' : 'Order Now'}
                </span>
                <span className="button-icon">→</span>
                <motion.div
                  className="button-background"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: userDetails ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </motion.div>
          </div>

          <div className="right-content">
            <div className="tiles-container">
              <div className="tiles-grid">
                {foodCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="tile"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.05,
                      zIndex: 2,
                    }}
                  >
                    <div className="tile-content">
                      <div className="tile-image-wrapper">
                        <img src={card.img} alt={card.title} className="tile-image" />
                        <div className="tile-gradient" />
                      </div>
                      <motion.div
                        className="tile-overlay"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="overlay-content">
                          <span className="view-details">Explore Dish</span>
                          <span className="arrow">↗</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="decorative-circle" />
              <div className="decorative-dots" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="how-it-works">
        <h1 id='title'>How it Works</h1>
        <div className="title-accent" />
        <div className="steps">
          <div className="step">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2>Choose Table</h2>
            <p>
              Initiate a search by specifying the menu item name and location. Based on
              search with other filters select a vendor from the list.
            </p>
          </div>
          <div className="connector">
            <div className="line"></div>
            <div className="dot"></div>
          </div>
          <div className="step">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h2>Pick your Dishes</h2>
            <p>
              Visit vendor's page from search result. Select dishes of your choice
              and add it to cart.
            </p>
          </div>
          <div className="connector">
            <div className="line"></div>
            <div className="dot"></div>
          </div>
          <div className="step">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h2>Place Order</h2>
            <p>
              After adding food item from a vendor to the cart, user can place an order
              by completing the payment process. Vendor can accept or decline the order request.
            </p>
          </div>
        </div>
      </div>



      <section className="testimonial-section">
        <div className="testimonial-background" />
        <div className="testimonial-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h2 className="section-title">What Our Guests Say</h2>
            <div className="title-accent" />
            <p className="section-subtitle">Experiences that delight</p>
          </motion.div>

          <div className="testimonial-slider">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="testimonial-slide"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="testimonial-content">
                  <div className="quote-container">
                    <FaQuoteLeft className="quote-icon" />
                    <motion.p
                      className="quote"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {testimonials[currentIndex].quote}
                    </motion.p>
                  </div>

                  <motion.div
                    className="author-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="author-image-container">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].author}
                        className="author-image"
                      />
                      <div className="image-accent" />
                    </div>
                    <div className="author-details">
                      <h3 className="author-name">{testimonials[currentIndex].author}</h3>
                      <p className="author-title">{testimonials[currentIndex].title}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="navigation-dots">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <div className="slider-controls">
              <motion.button
                className="control-btn prev-btn"
                onClick={prevSlide}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-color)' }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                className="control-btn next-btn"
                onClick={nextSlide}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-color)' }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
        </div>
      </section>




      <motion.button
        className="media-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/media')}
      >
        <Camera size={24} color="#FFFFFF" />
      </motion.button>

      <motion.div
        className="feedback-button-container"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={() => navigate('/feedback')}
      >
        <button
          className="feedback-button"
          aria-label="Provide feedback"
        >
          <MessageSquare size={24} color="white" />
        </button>
      </motion.div>
      {showModal && <Modal onClose={closeModal} />}
    </div>
  );
};

export default Home;
