require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidable());

mongoose.connect("mongodb://localhost/User", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const listenRoute = require("./routes/login");
const sign_upRoute = require("./routes/sign_up");

app.use(listenRoute);
app.use(sign_upRoute);

app.all("*", function (req, res) {
  res.json({ message: "all routes" });
});

app.listen(3000, () => {
  console.log("Server Started ;)");
});
