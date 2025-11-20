const mongoose = require("mongoose");
const express = require('express');
const Project = require( "../models/Project.js");
const  User = require("../models/User.js");
const FileNode = require("../models/FileNode");
const router = express.Router();



router.post("/", async (req, res) => {
  try {
    const { name, description, type, visibility, ownerId } = req.body;

    // Create the project
    const newProject = await Project.create({
      name,
      description,
      type,
      visibility,
      ownerId,
      collaborators: [ownerId],
    });

    // Create the ROOT folder for this project
    const rootFolder = await FileNode.create({
      name: "root",
      type: "directory",
      projectId: newProject._id,
      parentId: null,
      children: [],
    });

    // Link the root folder ID to the project
    newProject.rootId = rootFolder._id;
    await newProject.save();

    // Return project + root folder
    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
      rootFolder,
    });

  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Server error creating project." });
  }
});


router.get("/", async (req, res) => {
    try {
      const projects = await Project.find().sort({ updatedAt: -1 });
      res.json(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      res.status(500).json({ message: "Server error fetching projects." });
    }
  });


  router.get("/search", async (req, res) => {
    const q = req.query.q || "";
    const projects = await Project.find({
      name: { $regex: q, $options: "i" },
    });
    res.json(projects);
  });

  
router.get("/:id", async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      console.error("Error fetching project:", err);
      res.status(500).json({ message: "Server error fetching project" });
    }

  });

  router.get("/user/:userId", async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId); 
  
      const ownedProjects = await Project.find({ ownerId: userId });
      const collaboratingProjects = await Project.find({
        collaborators: userId,
        ownerId: { $ne: userId },
      });
  
      res.json({ ownedProjects, collaboratingProjects });
    } catch (err) {
      console.error("Error fetching user projects:", err);
      res.status(500).json({ message: "Server error fetching projects." });
    }
  });
  

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await FileNode.deleteMany({ projectId : id });
      
      await Message.deleteMany({ projectId : id });

      const deleted = await Project.findByIdAndDelete({projectId : id});
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (err) {
      console.error("Error deleting project:", err);
      res.status(500).json({ message: "Server error deleting project" });
    }
  });
  
  router.get("/:projectId/collaborators", async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId).populate("collaborators", "fullName email avatar");
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project.collaborators);
    } catch (err) {
      console.error("Error fetching collaborators:", err);
      res.status(500).json({ message: "Server error fetching collaborators." });
    }
  });
  
  // ✅ Add a collaborator by email
  router.post("/:projectId/collaborators", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      if (project.collaborators.includes(user._id)) {
        return res.status(400).json({ message: "User already a collaborator" });
      }
  
      project.collaborators.push(user._id);
      await project.save();
  
      res.json({ message: "Collaborator added", collaborator: user });
    } catch (err) {
      console.error("Error adding collaborator:", err);
      res.status(500).json({ message: "Server error adding collaborator." });
    }
  });
  
  // ✅ Remove collaborator
  router.delete("/:projectId/collaborators/:userId", async (req, res) => {
    try {
      const { projectId, userId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      project.collaborators = project.collaborators.filter(
        (collabId) => collabId.toString() !== userId
      );
      await project.save();
  
      res.json({ message: "Collaborator removed" });
    } catch (err) {
      console.error("Error removing collaborator:", err);
      res.status(500).json({ message: "Server error removing collaborator." });
    }
  });
  
module.exports = router;
