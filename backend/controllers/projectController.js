const Project = require("../models/Project");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");

// --- NEW: OPTIMIZED DASHBOARD STATS ---
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get project count for this user
    const projectCount = await Project.countDocuments({ members: userId });

    // Get ticket stats using aggregation
    // This finds all projects the user is in, then joins the tickets, then counts them by status
    const ticketStats = await Project.aggregate([
      { $match: { members: userId } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "project",
          as: "projectTickets",
        },
      },
      { $unwind: "$projectTickets" },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          todo: {
            $sum: { $cond: [{ $eq: ["$projectTickets.status", "todo"] }, 1, 0] },
          },
          done: {
            $sum: { $cond: [{ $eq: ["$projectTickets.status", "done"] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = ticketStats[0] || { totalTickets: 0, todo: 0, done: 0 };

    res.json({
      projects: projectCount,
      tickets: stats.totalTickets,
      todo: stats.todo,
      done: stats.done,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating stats" });
  }
};

// Create Project
exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    owner: req.user.id,
    members: [req.user.id],
  });
  res.status(201).json(project);
};

// Get User Projects
exports.getProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
  }).populate("owner", "name email");
  res.json(projects);
};

// Add Member
exports.addMember = async (req, res) => {
  const { projectId, memberId } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.owner.toString() !== req.user.id)
    return res.status(403).json({ message: "Only owner can add members" });
  if (!project.members.includes(memberId)) {
    project.members.push(memberId);
    await project.save();
  }
  res.json(project);
};

exports.updateProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  project.name = name || project.name;
  project.description = description || project.description;
  const updatedProject = await project.save();
  res.json(updatedProject);
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project removed" });
};