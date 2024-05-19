const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signin", authController.signin);
router.post("/verify-token", authController.verifyToken);

module.exports = router;
