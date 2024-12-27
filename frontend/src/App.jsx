import React from 'react';
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


function App() { 
  return (
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-customer" element={<NewCustomer />} />
          <Route path="/regular-customer" element={<RegularCustomer />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Cart />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/media" element={<Media />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Routes>
        <OrderPopup />
        <Footer />
      </div>
  );
}

export default App;