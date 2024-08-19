const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// dotenv for call value in file .env
dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// this for call all router from router.js
app.use("/api", require("./routes/router"));

// this for show message if we access port
app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, async () => {
  console.log("server up and running on port " + process.env.PORT);
});

module.exports = app;
