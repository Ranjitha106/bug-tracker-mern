const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

// ADD COMMENT TO A TICKET
exports.addComment = async (req, res) => {
  const { text, ticketId } = req.body;

  if (!text || !ticketId) {
    return res.status(400).json({ message: "Text and ticketId required" });
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const comment = await Comment.create({
    text,
    ticket: ticketId,
    user: req.user.id,
  });

  res.status(201).json(comment);
};

// GET COMMENTS BY TICKET
exports.getCommentsByTicket = async (req, res) => {
  const comments = await Comment.find({ ticket: req.params.ticketId })
    .populate("user", "name email")
    .sort({ createdAt: 1 });

  res.json(comments);
};
