const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  updateUserProfile, // New import
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/users", protect, getUsers);
router.put("/profile", protect, updateUserProfile); // Added for Settings page save

module.exports = router;