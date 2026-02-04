const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();

// All routes are protected
router.route("/")
  .post(protect, authorizeRoles("admin"), createCategory)
  .get(protect, getCategories);

router.route("/:id")
  .get(protect, getCategory)
  .put(protect, authorizeRoles("admin"), updateCategory)
  .delete(protect, authorizeRoles("admin"), deleteCategory);

module.exports = router;