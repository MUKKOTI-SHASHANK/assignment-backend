const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post(
  '/signup',
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ user: { id: user._id, username: user.username }, token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
        }
        );
        
        router.post(
        '/login',
        body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
        async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ user: { id: user._id, username: user.username }, token });
        } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
        }
        }
        );
        
        module.exports = router;
        
        