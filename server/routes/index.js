const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Routes Api Rest

//Auth
app.use(require("./auth"));

//Users
app.use(require("./users"));

//Categories
app.use(require("./categories"));

//Product
app.use(require("./products"));

//Uploads
app.use(require("./uploads"));

//Pictures
app.use(require("./pictures"));

module.exports = app;