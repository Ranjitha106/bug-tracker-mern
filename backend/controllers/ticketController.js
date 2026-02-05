const Ticket = require("../models/Ticket");
const Project = require("../models/Project");

// CREATE TICKET
exports.createTicket = async (req, res) => {
  const { title, description, priority, assignee, projectId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Only project members can create tickets
  if (!project.members.includes(req.user.id)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    project: projectId,
    assignee,
    createdBy: req.user.id,
  });

  res.status(201).json(ticket);
};

// GET TICKETS BY PROJECT
exports.getTicketsByProject = async (req, res) => {
  const tickets = await Ticket.find({ project: req.params.projectId })
    .populate("assignee", "name email")
    .populate("createdBy", "name email");

  res.json(tickets);
};

// --- NEW: GET SINGLE TICKET DETAILS ---
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("project", "name");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching ticket" });
  }
};

// UPDATE TICKET
exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  Object.assign(ticket, req.body);
  await ticket.save();

  res.json(ticket);
};

// DELETE TICKET
exports.deleteTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  await ticket.deleteOne();
  res.json({ message: "Ticket removed" });
};