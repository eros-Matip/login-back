const express = require("express");
const router = express.Router();

// crypto-js is a library of cryptographic algorithms.
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// uid2 allows you to generate random strings according to a given length.
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/sign_up", async (req, res) => {
  try {
    const email = req.fields.email;
    const username = req.fields.username;
    const name = req.fields.name;
    const firstname = req.fields.firstname;
    const password = req.fields.password;
    const passwordConfirm = req.fields.passwordConfirm;
    const dateOfBirth = new Date(req.fields.dateOfBirth);

    // Looking for in the database if the user already exist
    const userFinded = await User.findOne({ email: email });

    //   The salt is a random string of characters, different for each user and which will generate the hash in combination with the password.
    const salt = uid2(12);
    //   The hash represents the user's password, salted and hashed with the SHA-256 algo (you can use the crypto-js package).
    const hash = SHA256(password + salt).toString(encBase64);
    //   The token is a string of 16 random characters generated at the time of registration or authentication.
    const token = uid2(12);

    const newUser = new User({
      email,
      account: {
        username,
        name,
        firstname,
        dateOfBirth,
      },
      salt: salt,
      hash: hash,
      token: token,
    });

    // if the user is already saved in the database then an error will be issued
    if (userFinded) {
      return res.status(400).json({ error: `User already exist` });
    } else {
      // all parameters should be not empty || or for more precision you can specify where is the error by dissociating each error ex: if (username === "") {"is not good" } else{ "is good"}
      if (username && name && firstname && dateOfBirth !== "") {
        // The password and the passwordConfirm should be similar
        if (password === passwordConfirm) {
          await newUser.save();
          return res.status(200).json({ user: newUser });
        } else {
          return res
            .status(400)
            .json({ message: "Password and ConfirmPassword aren't similar" });
        }
      } else {
        return res.status(400).json({ error: `missing parameter` });
      }
    }
  } catch (error) {
    console.error({ error: error.message });
  }
});

module.exports = router;
