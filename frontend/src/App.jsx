import React,{useState} from 'react';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Menu from './Pages/Menu/Menu';
import Cart from './Pages/Cart/Cart';
import NewCustomer from './Pages/TableSelection/NewCustomer';
import RegularCustomer from './Pages/TableSelection/RegularCustomer';
import Footer from './Components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import OrderSuccess from './Pages/OrderSuccess/OrderSuccess';
import OrderPopup from './Pages/OrderPopup/OrderPopup';
import Feedback from './Pages/Feedback/Feedback';
import Media from './Pages/Media/Media';
import About from './Pages/About/About';
import Profile from './Components/Profile/Profile';
import LogoutConfirm from './Components/Navbar/LogoutConfirm';
import { UserProvider } from './Components/Profile/UserContext';
import { useUser } from './Components/Profile/UserContext';
import { useCart } from './Pages/Cart/CartContext';



function App() {
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
  const { setUserDetails } = useUser();
  const { clearCart } = useCart();

  const handleLogout = () => {
    setUserDetails(null);
    clearCart();
    sessionStorage.removeItem('userDetails');
    setIsLogoutConfirmVisible(false);
  };
  return (
    <UserProvider>
    <div className="app">
    <Navbar onLogoutClick={() => setIsLogoutConfirmVisible(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/regular-customer" element={<RegularCustomer />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/media" element={<Media />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      </Routes>
      <OrderPopup />
      <Footer />
      {isLogoutConfirmVisible && (
        <LogoutConfirm
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmVisible(false)}
        />
      )}
    </div>
    </UserProvider>
  );
}

export default App;