// In your routes file (e.g., routes/user.js)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

exports.googleTokens = async (req, res) => {
  try {
    const { access_token, refresh_token, expiry_date } = req.body;
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user with Google tokens
    user.googleTokens = {
      access_token,
      refresh_token,
      expiry_date
    };
    
    await user.save();
    
    res.json({ success: true, message: 'Google tokens updated successfully' });
  } catch (error) {
    console.error('Update Google tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
// In your routes file (e.g., routes/user.js)

const tokenController = {
    googleTokens:exports.googleTokens,
}
module.exports = tokenController;
// In your routes file (e.g., routes/user.js)