const PowerData = require("../models/PowerData");

exports.getRecentPowerData = async (req, res) => {
  try {
    const data = await PowerData.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};