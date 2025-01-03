const Order = require('../models/order');

exports.checkout = async (req, res) => {
  const { selectedTable, mobileNumber, userName, selectedRestaurant, likeRestaurant } = req.body;

  if (!selectedTable) {
    return res.status(400).json({ success: false, message: 'Table number is missing' });
  }
  if (!mobileNumber || !userName) {
    return res.status(400).json({ success: false, message: 'Mobile number and user name are required' });
  }

  try {
    // Check if the user already exists
    const existingOrder = await Order.findOne({ mobileNumber });
    if (existingOrder) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const order = await Order.create({
      selectedTable,
      mobileNumber,
      userName,
      selectedRestaurant: selectedRestaurant || null,
      likeRestaurant: likeRestaurant || false,
      orderStatus: 'pending',
      items: [], 
    });

    return res.status(201).json({
      success: true,
      message: 'Order initialized successfully',
      orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize the order',
      error: error.message,
    });
  }
};




exports.getUserOrders = async (req, res) => {
  const { mobileNumber } = req.params;

  try {
    // Find orders by mobile number
    const orders = await Order.find({ mobileNumber }).sort({ createdAt: -1 });

    // Check if no orders or user found for the given mobile number
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mobile number not found. Please register as a new customer.',
      });
    }

    // If user exists, return success and the orders
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    // Handle any other errors
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message,
    });
  }
};



exports.updateUserDetails = async (req, res) => {
  const { mobileNumber } = req.params; // Get mobile number from URL params
  const updatedData = req.body; // Get updated data from the request body

  try {
    // Find the user by mobile number and update their details
    const updatedUser = await Order.findOneAndUpdate(
      { mobileNumber }, // Filter by mobile number
      updatedData, // Update fields with the new data
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User with this mobile number not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User details updated successfully.',
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user details.',
      error: error.message,
    });
  }
};








exports.updateOrderItems = async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid items data' });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: { items: items } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update the order',
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
