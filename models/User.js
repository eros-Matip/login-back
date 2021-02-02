const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    username: String,
    name: String,
    firstname: String,
    dateOfBirth: Date,
  },
  salt: String,
  hash: String,
  token: String,
});

module.exports = User;
