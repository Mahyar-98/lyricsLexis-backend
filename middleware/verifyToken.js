const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
