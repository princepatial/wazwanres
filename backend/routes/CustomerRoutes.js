const express = require('express');
const { addCustomer, getCustomerByMobile, updateCustomer, getAllCustomers } = require('../Controller/CustomerController');

const router = express.Router();

router.post('/add-customer', addCustomer);

router.get('/get-customer', getCustomerByMobile);

router.put('/update-customer', updateCustomer);

router.get('/customers', getAllCustomers);

module.exports = router;
