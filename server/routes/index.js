const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//index
app.get("/", (req, res) => {
  res.status(200).json("Express Rest Server");
});

//Routes Api Rest

//Auth
app.use(require("./auth"));

//Users
app.use(require("./users"));


module.exports = app;