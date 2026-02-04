const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Asset = require("./src/models/Asset");
const bcrypt = require("bcryptjs");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const seedData = async () => {
  try {
    // Delete existing data
    await User.deleteMany();
    await Asset.deleteMany();

    // Hash password for admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create default admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    // Create sample assets
    const sampleAssets = [
      {
        assetName: "Dell Laptop",
        assetType: "Laptop",
        serialNumber: "DL2023001",
        brand: "Dell",
        model: "XPS 13",
        purchaseDate: new Date(),
        condition: "Good",
        status: "Available",
        assignedTo: null,
        location: "Warehouse A"
      },
      {
        assetName: "HP Desktop",
        assetType: "Desktop",
        serialNumber: "HD2023002",
        brand: "HP",
        model: "EliteDesk",
        purchaseDate: new Date(),
        condition: "New",
        status: "In Use",
        assignedTo: adminUser._id,
        location: "Office 101"
      }
    ];

    await Asset.insertMany(sampleAssets);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();