const express = require("express");
const cors = require("cors");

// Require the routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const songsRouter = require("./routes/songs");
const wordsRouter = require("./routes/words");

const app = express();

app.use(cors());

// Use the routers
app.get("/", (req, res) => res.send("hi"));
app.use("/auth", authRouter);
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

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server listening on port ${port}...`),
);
