const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const express = require('express');

const router = express.Router();

// ✅ Middleware to check auth token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ GET user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({result : user});
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    fullName: { $regex: q, $options: "i" },
  });
  res.json(users);
});


// ✅ UPDATE user profile
router.put("/update", authenticate, async (req, res) => {
  try {
    const { name, bio, avatar, github } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar, github },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", result: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
