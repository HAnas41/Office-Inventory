const Asset = require("../models/Asset");

// @desc    Get assets by category
// @route   GET /api/reports/assets-by-category
// @access  Private/Admin & Manager
exports.getAssetsByCategory = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      { $group: { _id: "$assetType", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get assets by location
// @route   GET /api/reports/assets-by-location
// @access  Private/Admin & Manager
exports.getAssetsByLocation = async (req, res) => {
  try {
    const data = await Asset.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get damaged assets
// @route   GET /api/reports/damaged-assets
// @access  Private/Admin & Manager
exports.getDamagedAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ status: "Damaged" }).populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get low stock report
// @route   GET /api/reports/low-stock
// @access  Private/Admin
exports.getLowStockReport = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5; // Default threshold of 5

    // For this report, we group by assetType and count available items
    const data = await Asset.aggregate([
      { $match: { status: "Available" } },  // Only count available assets
      { $group: { _id: "$assetType", count: { $sum: 1 } } },
      { $match: { count: { $lt: threshold } } },  // Show only if count is less than threshold
    ]);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};