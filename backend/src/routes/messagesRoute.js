const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// GET messages for a project
router.get("/:projectId/messages", async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
