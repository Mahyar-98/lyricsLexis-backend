const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();

// Require the routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const songsRouter = require("./routes/songs");
const wordsRouter = require("./routes/words");

const app = express();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

// Use the body parser middleware to be able to parse the body of HTTP POST requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use morgan as HTTP logger to show the HTTP method and route of each request
app.use(morgan("dev"));

app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: { "script-src": ["'self'"] },
  }),
);
const limiter = RateLimit({
  windowMS: 1 * 60 * 1000,
  max: 40,
});
app.use(limiter);

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  }),
);

// Use the routers
app.get("/", (req, res) => res.send("Welcome to LyricsLexis backend API"));
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/users", songsRouter);
app.use("/users", wordsRouter);

// Proxy route
app.get("/api/dictionary/:word", async (req, res) => {
  try {
    const word = req.params.word;
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// Use http-errors middleware to generate a 404 error in case no route matches
app.use((req, res, next) => {
  next(createError(404));
});

// Use a custom error handler middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server listening on port ${port}...`),
);
