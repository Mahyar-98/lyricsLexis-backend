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
  const songId = req.params.songId;

  // Find the user by userId
  const user = await User.findById(userId);

  // Find the song by songId within the user's songs array
  const song = user.songs.find((song) => song._id == songId);

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  res.json(song);
});

// Controller to create a new song for a user
exports.song_create = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { title, artist, lyrics } = req.body;

  // Create a new song document
  const newSong = { title, artist, lyrics };

  // Find the user by userId and push the new song to the songs array
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { songs: newSong } },
    { new: true },
  );

  res.status(201).json(user.songs);
});

// Controller to delete a specific song of a user
exports.song_delete = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const songId = req.params.songId;

  // Find the user by userId and pull the song from the songs array
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { songs: { _id: songId } } },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.songs);
});
