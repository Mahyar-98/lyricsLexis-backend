const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// Controller to get all songs of a user
exports.songs_read = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find the user by userId and return the songs array
  const user = await User.findById(userId);
  res.json(user.songs);
});

// Controller to get a specific song of a user
exports.song_read = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  let { title, author } = req.params;
  title = decodeURIComponent(title);
  author = decodeURIComponent(author);

  // Find the user by userId
  const user = await User.findById(userId);

  // Find the song by songId within the user's songs array
  const song = user.songs.find(
    (song) => song.title === title && song.author === author,
  );

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  res.json(song);
});

// Controller to create a new song for a user
exports.song_create = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { title, author } = req.body;

  // Check if the song already exists for the user
  const user = await User.findById(userId);
  const existingSong = user.songs.find(
    (song) => song.title === title && song.author === author,
  );

  if (existingSong) {
    return res
      .status(400)
      .json({ message: "Song already exists for the user" });
  }

  // Create a new song document
  const newSong = { title, author };

  // Find the user by userId and push the new song to the songs array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { songs: newSong } },
    { new: true },
  );

  res.status(201).json(updatedUser.songs);
});

// Controller to delete a specific song of a user
exports.song_delete = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  let { title, author } = req.params;
  title = decodeURIComponent(title);
  author = decodeURIComponent(author);

  // Find the user by userId and pull the song from the songs array
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { songs: { title, author } } },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.songs);
});
