import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
const router = express.Router();

// Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// GET all tasks (sorted by order)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
});

// POST new task
router.post("/", auth, async (req, res) => {
  try {
    // Get the count of existing tasks to set order
    const taskCount = await Task.countDocuments({ userId: req.userId });
    const newTask = await Task.create({ 
      ...req.body, 
      userId: req.userId,
      order: taskCount  // Set order based on existing tasks
    });
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
});

// PUT update task
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
});

// DELETE task
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json({ msg: "Deleted", task: deleted });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task", error: err.message });
  }
});

export default router;