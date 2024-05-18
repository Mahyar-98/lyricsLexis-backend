const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const cors = require("cors")

const app = express();

// Require the routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
//const songsRouter = require("./routes/songs");
//const wordsRouter = require("./routes/words");

app.use(cors())

// Add local variables to make them available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Use the routers
app.get("/", (req, res) => res.send("hi"));
//app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Proxy route
app.get('/api/dictionary/:word', async (req, res) => {
  try {
      const word = req.params.word;
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server listening on port ${port}...`),
);
