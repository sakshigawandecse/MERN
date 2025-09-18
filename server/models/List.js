import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  position: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("List", listSchema);
