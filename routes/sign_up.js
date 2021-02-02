const express = require("express");
const router = express.Router();

// crypto-js is a library of cryptographic algorithms.
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// uid2 allows you to generate random strings according to a given length.
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/sign_up", (req, res) => {
  const password = req.fields.password;
  const passwordConfirm = req.fields.passwordConfirm;

  //   The salt is a random string of characters, different for each user and which will generate the hash in combination with the password.
  const salt = uid2(12);
  //   The hash represents the user's password, salted and hashed with the SHA-256 algo (you can use the crypto-js package).
  const hash = SHA256(password + salt).toString(encBase64);
  //   The token is a string of 16 random characters generated at the time of registration or authentication.
  const token = uid2(12);

  try {
    const newUser = new User({
      account: {
        username: req.fields.username,
        name: req.fields.name,
        firstname: req.fields.firstname,
        dateOfBirth: req.fields.dateOfBirth,
      },
      salt: salt,
      hash: hash,
      token: token,
    });

    if (password === passwordConfirm) {
      return res.status(200).json({ newUser });
    } else {
      return res
        .status(400)
        .json({ message: "Password and ConfirmPassword aren't similar" });
    }
  } catch (error) {
    console.error({ error: error.message });
  }
});

module.exports = router;
