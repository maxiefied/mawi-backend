const mongoose = require("mongoose");
const PowerData = require("../models/PowerData");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to DB - Simulating Power Usage...");
});

// Helper to simulate power usage in watts
function generateRandomPower() {
  return (Math.random() * 300 + 50).toFixed(2); // Between 50W and 350W
}

function simulateAndSave() {
  const newEntry = new PowerData({
    timestamp: new Date(),
    power: generateRandomPower(),
  });

  newEntry.save().then(() => {
    console.log(`Saved power data: ${newEntry.power}W at ${newEntry.timestamp}`);
  });
}

// Run every 5 seconds
setInterval(simulateAndSave, 5000);