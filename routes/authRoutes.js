const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SECRET (You can store it in a .env file)
const JWT_SECRET = 'your_super_secret_key';

// @route   POST /api/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// @route   POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;