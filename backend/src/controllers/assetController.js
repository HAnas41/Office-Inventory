const Asset = require("../models/Asset");

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private/Admin
exports.createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);

    res.status(201).json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate("assignedTo", "name email role");

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

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
exports.getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate("assignedTo", "name email role");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private/Admin & Manager (limited fields)
exports.updateAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with id of ${req.params.id}`
      });
    }

    const updates = req.body;

    // Manager restrictions - only allow specific fields to be updated
    if (req.user.role === "manager") {
      const allowed = ["status", "assignedTo", "location"];
      Object.keys(updates).forEach((key) => {
        if (!allowed.includes(key)) delete updates[key];
      });
    }

    asset = await Asset.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private/Admin
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with id of ${req.params.id}`
      });
    }

    await Asset.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};