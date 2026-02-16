const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

// Load env vars
dotenv.config();

// Connect to database
// Connect to database (Handled in app.js for Vercel, but we kept import for consistency)
// connectDB(); // Removed to avoid double connection / race conditions

const PORT = process.env.PORT || 5000;

// ✅ Only listen locally (NOT on Vercel)
if (process.env.NODE_ENV !== "production") {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections (Local only)
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

// ✅ Export for Vercel Serverless
module.exports = app;
