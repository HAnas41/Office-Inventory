const mongoose = require('mongoose');

const uri = "mongodb+srv://Inventory:anas6836@cluster0.mkxh4sv.mongodb.net/office_inventory";

console.log("Attempting to connect to MongoDB...");

mongoose.connect(uri)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Connection failed:", err.message);
        process.exit(1);
    });
