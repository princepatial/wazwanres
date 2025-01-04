const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  const { mobileNumber } = req.params; 
  const { selectedTable, items, totalAmount, paymentDetails } = req.body;


  if (!mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number is required.' });
  }
  if (!selectedTable) {
    return res.status(400).json({ success: false, message: 'Table number is required.' });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items are required.' });
  }
  if (!totalAmount) {
    return res.status(400).json({ success: false, message: 'Total amount is required.' });
  }
  if (!paymentDetails || !paymentDetails.paymentMethod || !paymentDetails.status || !paymentDetails.amount) {
    return res.status(400).json({
      success: false,
      message: 'Payment details are incomplete or missing required fields.',
    });
  }

  try {
    // Create the order
    const newOrder = new Order({
      selectedTable,
      mobileNumber,
      items,
      totalAmount,
      paymentDetails,  
    });

    
    const savedOrder = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      orderId: savedOrder.orderId,  
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order.',
      error: error.message,
    });
  }
};





// Fetch orders by mobile number
exports.getOrdersByMobile = async (req, res) => {
  const { mobileNumber } = req.params;

  if (!mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number is required.' });
  }

  try {
    // Find orders by mobile number
    const orders = await Order.find({ mobileNumber }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this mobile number.',
      });
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message,
    });
  }
};






// Fetch all orders in the database
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and sort by creation date (most recent first)
    const orders = await Order.find().sort({ createdAt: -1 });

    // If no orders are found
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found in the database.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      orders,
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message,
    });
  }
};









// Update the status of an order
exports.updateOrderStatusByMobile = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID is required.' });
  }

  if (!['pending', 'accepted', 'rejected', 'cooking', 'ready'].includes(orderStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status.',
    });
  }

  try {
    // Find the order by ID and update the status
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message,
    });
  }
};


// Fetch orders associated with a mobile number
exports.getOrdersByMobile = async (req, res) => {
  const { mobileNumber } = req.params; // Extract mobileNumber from the URL params

  // Validate input
  if (!mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number is required.' });
  }

  try {
    // Find all orders associated with the mobile number
    const orders = await Order.find({ mobileNumber }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this mobile number.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully.',
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message,
    });
  }
};




// Delete all orders associated with a mobile number
exports.deleteOrdersByMobile = async (req, res) => {
  const { mobileNumber } = req.params; // Extract mobile number from the URL params

  // Validate input
  if (!mobileNumber) {
    return res.status(400).json({ success: false, message: 'Mobile number is required.' });
  }

  try {
    // Find and delete orders associated with the mobile number
    const result = await Order.deleteMany({ mobileNumber });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this mobile number.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Orders deleted successfully.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete orders.',
      error: error.message,
    });
  }
};






exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;


  const validStatuses = ['pending', 'accepted', 'rejected', 'cooking', 'ready',];
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
