const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to database on every request (Vercel/Serverless pattern)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed in middleware:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// Enable CORS
const allowedOrigins = [
  'https://office-inventory-silk.vercel.app',
  'https://office-inventory-o5uy.vercel.app', // Backend itself, sometimes needed
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // For development, you might want to allow all, but for prod be strict
      // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      return callback(null, true); // Temporarily allow all for debugging if issues persist, or stick to list
    }
    return callback(null, true);
  },
  credentials: true
}));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Office Inventory API is running"
  });
});

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/assets", require("./routes/assetRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler middleware
app.use(require("./middleware/errorHandler"));

module.exports = app;