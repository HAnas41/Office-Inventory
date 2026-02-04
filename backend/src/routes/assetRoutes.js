const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset
} = require("../controllers/assetController");

const router = express.Router();

// All routes are protected
router.route("/")
  .post(protect, authorizeRoles("admin"), createAsset)
  .get(protect, getAssets);

router.route("/:id")
  .get(protect, getAsset)
  .put(protect, authorizeRoles("admin", "manager"), updateAsset)
  .delete(protect, authorizeRoles("admin"), deleteAsset);

module.exports = router;