const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const email = req.fields.email;
  const password = req.fields.password;

  return res.status(200).json({
    user: {
      email: email,
      salt: salt,
      hash: hash,
      token: token,
    },
  });
});

module.exports = router;
