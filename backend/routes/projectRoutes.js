const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  addMember,
  updateProject,
  deleteProject,
  getDashboardStats, // New import
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

// Routes
router.get("/stats", protect, getDashboardStats); // New optimized stats route
router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.post("/add-member", protect, addMember);

// Specific ID routes
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;