const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    // Get requests
    const { companyName, email, password } = req.body;
    //  Create db instance
    const user = new User({ companyName, email, password });
    // Save new user to database
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists in database.
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // If user exists, compare password from request to password in database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    // If the passwords match generate a JWT Token and sign it using your-secret-key
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};