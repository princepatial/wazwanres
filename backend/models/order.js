const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  items: [
    {
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  selectedTable: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userAddress: { type: String },
  selectedRestaurant: { type: String },
  likeRestaurant: { type: Boolean, default: false },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected','cooking','ready'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
});


const counterSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  sequence: { type: Number, default: 1001 },
});


const Counter = mongoose.model('Counter', counterSchema, 'counters');


async function generateOrderId() {
  const todayDate = new Date().getDate().toString();


  const counter = await Counter.findOneAndUpdate(
    { date: todayDate },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );


  const orderId = `ORD${todayDate}-${counter.sequence}`;
  return orderId;
}


orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = await generateOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'order');
