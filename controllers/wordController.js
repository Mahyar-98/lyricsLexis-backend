const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// Controller to get all words for a specific user
exports.words_read = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user.words);
});

// Controller to get a specific word for a specific user
exports.word_read = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const word = req.params.word;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const foundWord = user.words.find((w) => w.word === word);
  if (!foundWord) {
    return res.status(404).json({ message: "Word not found" });
  }
  res.json(foundWord);
});

// Controller to create a new word for a specific user
exports.word_create = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { word } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.words.some((w) => w.word === word)) {
    return res.status(400).json({ message: "Word already exists" });
  }
  user.words.push({ word });
  await user.save();
  res.status(201).json(user.words);
});

// Controller to delete a specific word for a specific user
exports.word_delete = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const wordToDelete = req.params.word;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const filteredWords = user.words.filter((w) => w.word !== wordToDelete);
  if (filteredWords.length === user.words.length) {
    return res.status(404).json({ message: "Word not found" });
  }
  user.words = filteredWords;
  await user.save();
  res.status(200).json({ message: "Word deleted successfully" });
});
