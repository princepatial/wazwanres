const express = require('express');
const { checkUser, verifyOTP } = require('../Controller/otpController');

const router = express.Router();

// Route to send OTP
router.post('/sent-otp', checkUser);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

module.exports = router;
