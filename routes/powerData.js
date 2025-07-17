const express = require('express');
const router = express.Router();
const PowerData = require('../models/PowerData');

// POST: Add power consumption data
router.post('/', async (req, res) => {
  try {
    const { deviceName, consumption } = req.body;
    const data = new PowerData({ deviceName, consumption });
    await data.save();
    res.status(201).json({ message: 'Data saved', data });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
  }
});

// GET: Retrieve all power data
router.get('/', async (req, res) => {
  try {
    const allData = await PowerData.find().sort({ timestamp: -1 });
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

module.exports = router;
