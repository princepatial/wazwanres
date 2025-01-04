const Customer = require('../models/Customer');

exports.addCustomer = async (req, res) => {
    const { customerName, mobileNumber, address, likeRestaurant } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ mobileNumber });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        const customer = new Customer({ customerName, mobileNumber, address, likeRestaurant });
        await customer.save();

        res.status(201).json({ message: 'Customer details saved successfully' });
    } catch (error) {
        console.error('Error saving customer details:', error.message);
        res.status(500).json({ message: 'Failed to save customer details' });
    }
};


exports.getCustomerByMobile = async (req, res) => {
    const { mobileNumber } = req.query; // Get mobile number from the query parameter

    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
        const customer = await Customer.findOne({ mobileNumber });
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ customer });
    } catch (error) {
        console.error('Error fetching customer details:', error.message);
        res.status(500).json({ message: 'Failed to fetch customer details' });
    }
};




exports.updateCustomer = async (req, res) => {
    const { mobileNumber } = req.query;  // Get the mobile number from query parameters
    const { customerName, address, likeRestaurant } = req.body;  // Get updated customer data from the request body

    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
        // Find customer by mobile number
        const customer = await Customer.findOne({ mobileNumber });
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the customer details
        customer.customerName = customerName || customer.customerName;
        customer.address = address || customer.address;
        customer.likeRestaurant = likeRestaurant || customer.likeRestaurant;

        // Save the updated customer
        await customer.save();

        res.status(200).json({ message: 'Customer details updated successfully' });
    } catch (error) {
        console.error('Error updating customer details:', error.message);
        res.status(500).json({ message: 'Failed to update customer details' });
    }
};
