const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Twilio credentials
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error('Missing Twilio environment variables.');
  process.exit(1);
}

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

// Temporary in-memory OTP store (use a database or secure storage in production)
const otpStorage = {};

// Send OTP
exports.checkUser = async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || mobileNumber.length !== 10 || isNaN(mobileNumber)) {
    return res.status(400).json({ message: 'Invalid mobile number' });
  }

  try {
    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStorage[mobileNumber] = otp; // Store OTP temporarily with mobile number as key

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: `+91${mobileNumber}`, 
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }

  try {
    // Check OTP
    const storedOtp = otpStorage[mobileNumber];

    if (storedOtp && storedOtp.toString() === otp.toString()) {
      delete otpStorage[mobileNumber]; // Remove OTP after successful verification
      return res.status(200).json({ message: 'OTP verified successfully' });
    }

    res.status(400).json({ message: 'Invalid OTP' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP. Please try again later.' });
  }
};
