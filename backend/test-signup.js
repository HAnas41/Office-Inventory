const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load env vars manually for the script
process.env.MONGO_URI = "mongodb+srv://Inventory:anas6836@cluster0.mkxh4sv.mongodb.net/office_inventory";
process.env.JWT_SECRET = "test_secret";
process.env.JWT_EXPIRES_IN = "1d";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const testUser = {
            name: "Test User",
            email: "test-" + Date.now() + "@example.com",
            password: "password123",
            role: "viewer"
        };

        console.log("Attempting to create user:", testUser);

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);

        // Create user
        const user = await User.create({
            name: testUser.name,
            email: testUser.email,
            password: hashedPassword,
            role: testUser.role,
        });

        console.log("✅ User created successfully:", user._id);

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log("✅ Token generated successfully");

        // Cleanup
        await User.findByIdAndDelete(user._id);
        console.log("✅ Cleanup complete");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

run();
