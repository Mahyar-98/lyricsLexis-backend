const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.user_create);
router.get("/:userId", userController.user_read);

module.exports = router;
