import Card from "../models/Card.js";
import List from "../models/List.js";

// Create a new card
export const createCard = async (req, res) => {
  const { title, description, dueDate, labels, listId } = req.body;
  if (!title || !listId) return res.status(400).json({ message: "Title and listId are required" });

  try {
    const card = await Card.create({ title, description, dueDate, labels, list: listId });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all cards for a list
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a card
export const updateCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Move card to another list
export const moveCard = async (req, res) => {
  const { listId } = req.body;
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { list: listId }, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete card
export const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment to card
export const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const card = await Card.findById(req.params.id);
    card.comments.push({ user: req.user._id, text });
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
