import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBoard, getBoards, updateBoard, deleteBoard, getBoardById } from "../controllers/boardController.js";

const router = express.Router();

router.route("/")
  .post(protect, createBoard)
  .get(protect, getBoards);

router.route("/:id")
  .get(protect, getBoardById)   // getBoardById imported now
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

export default router;
