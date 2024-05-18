const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

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

exports.signout = (req, res, next) => {
  // Assuming you're using JWT stored in a cookie named 'token'
  res.clearCookie("token"); // Clear the JWT token cookie

  res.status(200).json({
    success: true,
    message: "Signout successful",
  });
};
