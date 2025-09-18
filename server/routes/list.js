import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createList,
  getLists,
  updateList,
  deleteList
} from "../controllers/listController.js";

const router = express.Router();

// Create a new list
router.post("/", protect, createList);

// Get all lists in a board
router.get("/board/:boardId", protect, getLists);

// Update a list
router.put("/:id", protect, updateList);

// Delete a list
router.delete("/:id", protect, deleteList);

export default router;
