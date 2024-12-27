import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Camera} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();

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

  const openModal = () => {
    setShowModal(true);
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
        <motion.div
          className="content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="left-content">
            <motion.h1
              className="main-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Savor the <span className="highlight">Extraordinary</span>
            </motion.h1>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Embark on a culinary journey that transcends the ordinary.
              Discover flavors that ignite your senses and create memories.
            </motion.p>
            <motion.div
              className="explore-menu-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <button className="explore-menu-button" onClick={openModal}>
              Our Menu
                <motion.span
                  className="button-hover"
                  whileHover={{ width: "100%" }}
                />
              </button>
            </motion.div>

          </div>

          <div className="right-content">
            <motion.img
              src="/picc.png"
              alt="Chef"
              className="chef-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            />

            <div className="floating-cards">
              {foodCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className={`food-card card${card.id}`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
                  }}
                >
                  <div className="card-content">
                    <img src={card.img} alt={card.title} />
                    <h3>{card.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>


      <div className="how-it-works">
        <h1 id='title'>How it Works</h1>
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

      <motion.section
        className="reservation-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">Reserve Your Experience</h2>
        <div className="reservation-container">
          <motion.form
            className="reservation-form"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <select required>
                <option value="">Number of Guests</option>
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8+">8+ Guests</option>
              </select> 
               <button type="submit" className="submit-button">
                 Book Now
              </button>
            </div>
          </motion.form>
        </div>
      </motion.section>

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
        <button className="feedback-button">
          <MessageSquare size={24} color="#4CAF50" />
        </button>
      </motion.div>

      {showModal && <Modal onClose={closeModal} />}
    </div>
  );
};

export default Home;
