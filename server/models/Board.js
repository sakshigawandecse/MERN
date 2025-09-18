import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["Admin", "Editor", "Viewer"], default: "Viewer" },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Board", boardSchema);
