const mongoose = require("mongoose");

const powerDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  power: { type: Number, required: true },
});

module.exports = mongoose.model("PowerData", powerDataSchema);