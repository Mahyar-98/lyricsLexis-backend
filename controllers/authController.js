const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const verifyToken = require("../middleware/verifyToken");

exports.signin = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "No user found with the provided email address" });
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!isValidPassword) {
    return res.status(401).json({ message: "password is incorrect" });
  }
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: "12h",
  });
  res.json({ token });
});

exports.verifyToken = [
  verifyToken,
  (req, res, next) => {
    if (req.user) {
      return res.status(200).json({ message: "Token is valid" });
    }
  },
];
