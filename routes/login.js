const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.get("/login", async (req, res) => {
  try {
    const email = req.fields.email;
    const passwordForLogin = req.fields.password;

    // Looking for in the database if the user exist
    const userFinded = await User.findOne({ email: email });

    // check if the password in database is similar of this password
    const hashForLogin = SHA256(passwordForLogin + userFinded.salt).toString(
      encBase64
    );
    if (hashForLogin === userFinded.hash) {
      return res.status(200).json({ user: userFinded });
    } else {
      return res
        .status(400)
        .json({ error: `the password should be different` });
    }
  } catch (error) {
    console.error({ error: error.message });
  }
});

module.exports = router;
