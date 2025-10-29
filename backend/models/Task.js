import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskName: String,
  subject: String,
  estimatedTime: Number,
  priority: { type: String, default: "Medium" },
  status: { type: String, default: "pending" },
  order: { type: Number, default: 0 }  // NEW: For drag-drop ordering
}, {
  timestamps: true  // NEW: Adds createdAt and updatedAt
});

export default mongoose.model("Task", taskSchema);