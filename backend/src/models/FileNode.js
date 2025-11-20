const mongoose = require("mongoose");

const FileNodeSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "directory"], required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileNode",
      default: null,
      index: true,
    },
    content: { type: String, default: "" },     // files only
    isOpen: { type: Boolean, default: false },  // UI preference
  },
  { timestamps: true }
);

FileNodeSchema.index({ projectId: 1, parentId: 1 });

module.exports = mongoose.model("FileNode", FileNodeSchema);
