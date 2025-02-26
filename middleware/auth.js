const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    // Decode the JWT Token and verify it is correct using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get loggedInUser
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};