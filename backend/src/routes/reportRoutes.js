const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAssetsByCategory,
  getAssetsByLocation,
  getDamagedAssets,
  getLowStockReport
} = require("../controllers/reportController");

const router = express.Router();

// All routes are protected
router.route("/assets-by-category")
  .get(protect, authorizeRoles("admin", "manager"), getAssetsByCategory);

router.route("/assets-by-location")
  .get(protect, authorizeRoles("admin", "manager"), getAssetsByLocation);

router.route("/damaged-assets")
  .get(protect, authorizeRoles("admin", "manager"), getDamagedAssets);

router.route("/low-stock")
  .get(protect, authorizeRoles("admin"), getLowStockReport);

module.exports = router;