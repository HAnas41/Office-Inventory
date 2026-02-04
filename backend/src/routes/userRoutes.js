const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

// All routes are protected
router.route("/")
  .get(protect, authorizeRoles("admin"), getUsers);

router.route("/:id")
  .get(protect, authorizeRoles("admin"), getUser)
  .put(protect, authorizeRoles("admin"), updateUserRole)
  .delete(protect, authorizeRoles("admin"), deleteUser);

module.exports = router;