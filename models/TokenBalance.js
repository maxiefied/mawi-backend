// models/TokenBalance.js
const mongoose = require('mongoose');

const tokenBalanceSchema = new mongoose.Schema({
    totalTokens: {
        type: Number,
        required: true,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('TokenBalance', tokenBalanceSchema);