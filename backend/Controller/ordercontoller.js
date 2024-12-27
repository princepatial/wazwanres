const Order = require('../models/order');

exports.checkout = async (req, res) => {
    const { items, selectedTable, mobileNumber, userName, userAddress } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    if (!selectedTable) {
        return res.status(400).json({ success: false, message: 'Table number is missing' });
    }


    if (mobileNumber && !userName) {
        return res.status(400).json({ success: false, message: 'User name is required when mobile number is provided' });
    }

    try {
        const order = await Order.create({
            items,
            selectedTable,
            mobileNumber: mobileNumber || null, 
            userName: mobileNumber ? userName : null, 
            userAddress: userAddress || null, 
            orderStatus: 'pending',
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: order.orderId,
            order,
        });
    } catch (error) {
        console.error('Checkout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to place the order',
            error: error.message,
        });
    }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};





exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;


  const validStatuses = ['pending', 'accepted', 'rejected'];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid order status. Must be one of: pending, accepted, rejected' 
    });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};



exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      selectedTable: order.selectedTable,
      userName: order.userName,
      mobileNumber: order.mobileNumber,
      items: order.items,
      createdAt: order.createdAt,
      userAddress: order.userAddress
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching order details', 
      error: error.message 
    });
  }
};





// Existing update method now includes orderStatus
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { items, selectedTable, mobileNumber, userName, userAddress, orderStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        items, 
        selectedTable, 
        mobileNumber, 
        userName, 
        userAddress,
        orderStatus 
      },
      { new: true, runValidators: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update the order',
      error: error.message,
    });
  }
};

// DELETE: Delete an order by ID
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      deletedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete the order',
      error: error.message,
    });
  }
};
