const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: { type: String, required: true },
    userAvatar: { type: String },
    message: { type: String, required: true, trim: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);
