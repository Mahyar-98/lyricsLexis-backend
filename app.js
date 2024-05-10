const express = require("express");

const app = express();

// Require the routers
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const songsRouter = require("./routes/songs");
const wordsRouter = require("./routes/words");

// Use the routers
app.get("/", (req, res) => res.send("hi"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);



const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server listening on port ${port}...`),
);
