// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  phone: String,
  amount: Number,
  mpesaReceiptNumber: String,
  transactionDate: String,
  transactionType: String,
  status: { type: String, default: "Pending" },
  tokens: Number,
});

module.exports = mongoose.model("Payment", paymentSchema);