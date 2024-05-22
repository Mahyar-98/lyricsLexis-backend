const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordController");
const verifyToken = require("../middleware/verifyToken");

// Apply verifyToken middleware to all routes in this router
router.use(verifyToken);
router.get("/:userId/words", wordController.words_read);
router.get("/:userId/words/:word", wordController.word_read);
router.post("/:userId/words", wordController.word_create);
router.patch("/:userId/words/:word", wordController.word_update);
router.delete("/:userId/words/:word", wordController.word_delete);

module.exports = router;
