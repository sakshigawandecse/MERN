import Board from "../models/Board.js";

// Create a new board


export const createBoard = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Board title is required" });
  }

  try {
    const board = await Board.create({
      title,
      members: [{ user: req.user._id, role: "Admin" }],
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Optionally verify user is a member before returning

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all boards for the logged-in user
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ "members.user": req.user._id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update board title
export const updateBoard = async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Board title is required" });
  }

  try {
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ message: "Board not found" });

    // Check if user is a member
    const isMember = board.members.some(
      (m) => m.user.toString() === req.user._id
    );
    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.json(updatedBoard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a board
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Only Admin can delete
    const isAdmin = board.members.some(
      (m) => m.user.toString() === req.user._id && m.role === "Admin"
    );
    if (!isAdmin) return res.status(403).json({ message: "Not authorized" });

    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
