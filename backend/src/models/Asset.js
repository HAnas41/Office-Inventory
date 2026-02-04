const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetName: { type: String, required: true, trim: true },
    assetType: {
      type: String,
      required: true,
      enum: ["Laptop", "Desktop", "Printer", "Router", "Chair", "Table"],
    },
    serialNumber: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor", "Damaged"],
      default: "Good",
    },
    status: {
      type: String,
      enum: ["Available", "In Use", "Damaged"],
      default: "Available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);