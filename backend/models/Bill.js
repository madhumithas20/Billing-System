const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  customerName: String,
  date: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
    },
  ],
  totalAmount: Number,
});

module.exports = mongoose.model('Bill', billSchema);
