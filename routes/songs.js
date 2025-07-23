const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const verifyToken = require("../middleware/verifyToken");

// Apply verifyToken middleware to all routes in this router
router.use(verifyToken);
router.get("/:userId/songs", songController.songs_read);
router.get("/:userId/songs/:artist/:title", songController.song_read);
router.post("/:userId/songs", songController.song_create);
router.delete("/:userId/songs/:artist/:title", songController.song_delete);

module.exports = router;
