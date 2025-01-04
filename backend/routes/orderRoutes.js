const express = require('express');
const { 
  createOrder,
  getAllOrders,
  getOrdersByMobile,
  updateOrderStatusByMobile,
  deleteOrdersByMobile,
  updateOrderStatus,
  getOrderStatus,
} = require('../Controller/ordercontoller');
const router = express.Router();

router.post('/checkout/:mobileNumber', createOrder);

router.get('/orders', getAllOrders);

router.get('/:mobileNumber', getOrdersByMobile);


router.patch('/:orderId/status', updateOrderStatusByMobile);


router.delete('/:mobileNumber', deleteOrdersByMobile);

router.put('/:id/status', updateOrderStatus);


router.get('/status/:orderId', getOrderStatus);

module.exports = router;