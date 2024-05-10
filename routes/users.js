const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.user_create);
router.get("/:userId", userController.user_read);
router.put("/:userId", userController.user_update);
router.delete("/:userId", userController.user_delete);

module.exports = router;
