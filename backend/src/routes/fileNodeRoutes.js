const express = require("express");
const mongoose = require("mongoose");
const FileNode = require("../models/FileNode");
const { buildTree } = require("../utils/buildTree");

const router = express.Router();

/**
 * GET TREE
 */
router.get("/:projectId/tree", async (req, res) => {
  try {
    const { projectId } = req.params;
    const nodes = await FileNode.find({ projectId }).lean();

    const tree = buildTree(nodes, null);

    res.json({ tree });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching file tree" });
  }
});

/**
 * CREATE NODE (FILE OR DIRECTORY)
 */
router.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, type, parentId, content } = req.body;


    const node = await FileNode.create({
      projectId,
      name,
      type,
      parentId: parentId || null,
      content: content || "",
    });

    res.status(201).json({ node });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating node" });
  }
});

/**
 * RENAME NODE
 */
router.put("/:projectId/:nodeId/rename", async (req, res) => {
    try {
      const { projectId, nodeId } = req.params;
      const { newName } = req.body;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(nodeId)) {
        return res.status(400).json({ error: "Invalid nodeId" });
      }
  
      // Validate newName
      if (!newName || typeof newName !== "string") {
        return res.status(400).json({ error: "Invalid newName" });
      }
  
      // Fetch node
      const node = await FileNode.findOne({ _id: nodeId, projectId });
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
  
      // Prevent name conflicts in same directory
      const exists = await FileNode.findOne({
        parentId: node.parentId,
        projectId,
        name: newName,
        _id: { $ne: nodeId },
      });
  
      if (exists) {
        return res.status(400).json({ error: "Name already exists in folder" });
      }
  
      // Update name
      node.name = newName;
      await node.save();
  
      res.json({ node });
    } catch (err) {
      console.error("❌ Rename Error:", err);
      res.status(500).json({ error: "Error renaming node" });
    }
  });

/**
 * UPDATE FILE CONTENT
 */
router.put("/:projectId/:nodeId/content", async (req, res) => {
  try {
    const { projectId, nodeId } = req.params;
    const { content } = req.body;

    await FileNode.updateOne(
      { _id: nodeId, projectId },
      { $set: { content } }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating content" });
  }
});

/**
 * DELETE NODE (RECURSIVE)
 */
router.delete("/:projectId/:nodeId", async (req, res) => {
    try {
      const { projectId, nodeId } = req.params;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(nodeId)) {
        return res.status(400).json({ error: "Invalid nodeId" });
      }
  
      const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
  
      // Find node + all its children
      const nodeWithChildren = await FileNode.aggregate([
        { $match: { _id: nodeObjectId, projectId } }, // projectId is STRING
        {
          $graphLookup: {
            from: "filenodes",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parentId",
            as: "descendants",
          },
        },
      ]);
  
      if (!nodeWithChildren.length) {
        return res.status(404).json({ error: "Node not found" });
      }
  
      // Collect IDs to delete
      const toDelete = [nodeId];
      if (nodeWithChildren[0].descendants?.length) {
        for (const child of nodeWithChildren[0].descendants) {
          toDelete.push(String(child._id));
        }
      }
  
      await FileNode.deleteMany({ _id: { $in: toDelete } });
  
      res.json({ deletedIds: toDelete });
    } catch (err) {
      console.error("❌ Delete Node Error:", err);
      res.status(500).json({ error: "Error deleting node" });
    }
  });

module.exports = router;
