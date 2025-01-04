const express = require('express');
const { addCustomer, getCustomerByMobile, updateCustomer } = require('../Controller/CustomerController');

const router = express.Router();

router.post('/add-customer', addCustomer);

router.get('/get-customer', getCustomerByMobile);

router.put('/update-customer', updateCustomer);

module.exports = router;
