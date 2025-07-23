const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    // Each song is unique based on its title and artist combination
    unique: { partialFilterExpression: { title: 1, artist: 1 } },
  },
);

const wordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    learned: {
      type: Boolean,
      required: true,
      default: false,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    songs: [songSchema],
    words: [wordSchema],
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual("name").get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
