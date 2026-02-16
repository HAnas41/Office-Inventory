const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  console.log("Signup request received");

  try {
    const { name, email, password, role } = req.body;
    console.log("Signup payload:", { name, email, role }); // Don't log password

    // Check env vars presence
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is missing!");
      throw new Error("Server configuration error: JWT_SECRET missing");
    }

    // Basic validation
    if (!name || !email || !password || !role) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Role validation (strict)
    const allowedRoles = ["admin", "manager", "viewer"];
    if (!allowedRoles.includes(role)) {
      console.log(`Validation failed: Invalid role '${role}'`);
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check existing user
    console.log("Checking for existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log("Creating user in DB...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("User created:", user._id);

    // Generate JWT
    console.log("Generating JWT...");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' } // Fallback to 30d
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error details:", error);
    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // User find (password explicitly select)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};