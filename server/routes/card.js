import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCard, getCards, updateCard, moveCard, deleteCard, addComment } from "../controllers/cardController.js";

const router = express.Router();

// CRUD for cards
router.post("/", protect, createCard);
router.get("/list/:listId", protect, getCards);
router.put("/:id", protect, updateCard);
router.put("/:id/move", protect, moveCard);
router.delete("/:id", protect, deleteCard);
router.post("/:id/comment", protect, addComment);

export default router;
