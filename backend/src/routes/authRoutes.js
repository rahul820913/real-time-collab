const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// --- Register ---
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const capitalizeName = (name) => {
      if (!name) return "";
      return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    };

    const formattedFullName = capitalizeName(fullName);

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      fullName: formattedFullName,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userResponse = {
      _id: result._id,
      fullName: result.fullName,
      email: result.email,
      avatar: result.avatar,
      bio: result.bio,
      github: result.github,
      role: result.role,
    };

    res.status(201).json({ result: userResponse, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong during registration." });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Include password field explicitly
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userResponse = {
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      avatar: existingUser.avatar,
      bio: existingUser.bio,
      github: existingUser.github,
      role: existingUser.role,
    };

    res.status(200).json({ result: userResponse, token });
  } catch (error) {
    console.error("Login Error:", error); // 👈 Add this for debugging
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
