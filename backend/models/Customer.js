const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerName: String,
    mobileNumber: { type: String, unique: true },
    address: String,
    likeRestaurant: Boolean,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', CustomerSchema,"customers");
