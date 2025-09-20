import List from "../models/List.js";

// Create a new list in a board
export const createList = async (req, res) => {
  try {
const { title, board, position } = req.body;
if (!title || !board) {
  return res.status(400).json({ message: "Title and board are required" });
}
const list = await List.create({ title, board, position });

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all lists for a board
export const getLists = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort("position");
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a list (title or position)
export const updateList = async (req, res) => {
  try {
    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a list
export const deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
