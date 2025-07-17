// routes/powerRoutes.js

const express = require('express');
const router = express.Router();
const Power = require('../models/Power');

// PUT /api/power/appliance/:name
router.put('/appliance/:name', async (req, res) => {
const applianceName = req.params.name;
const { state } = req.body;

const validAppliances = ['circuit', 'bulb', 'socket', 'shower', 'cooker'];
if (!validAppliances.includes(applianceName)) {
return res.status(400).json({ message: 'Invalid appliance name' });
}

try {
// Find the latest document or create one if none exists
let latestDoc = await Power.findOne().sort({ timestamp: -1 });

if (!latestDoc) {
  latestDoc = new Power();
}

// Update the state of the specified appliance
latestDoc.appliances[applianceName] = state;

await latestDoc.save();

res.json({
  message: `Appliance "${applianceName}" updated to ${state ? 'ON' : 'OFF'}`,
  appliances: latestDoc.appliances
});
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Failed to update appliance state' });
}
});

// POST /api/power/report
router.post('/report', async (req, res) => {
  try {
    const { power, voltage, current } = req.body;

    const newEntry = new Power({
      power,
      voltage,
      current,
      timestamp: new Date(),
    });

    await newEntry.save();

    res.status(201).json({ message: 'Power data received' });
  } catch (err) {
    console.error('❌ Failed to save power data:', err.message);
    res.status(500).json({ message: 'Failed to save power data', error: err.message });
  }
});

module.exports = router;

router.get('/latest', async (req, res) => {
  const latestDoc = await Power.findOne().sort({ timestamp: -1 });
  if (!latestDoc) return res.json({ appliances: {} });
  res.json({ appliances: latestDoc.appliances });
});
