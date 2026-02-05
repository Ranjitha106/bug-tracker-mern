const express = require("express");
const {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  getTicketById, // New import
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/", protect, createTicket);
router.get("/:projectId", protect, getTicketsByProject);
router.get("/detail/:id", protect, getTicketById); // Added this for fetching one ticket
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

module.exports = router;