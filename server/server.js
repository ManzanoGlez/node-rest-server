require("./config/config");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.URL_DB, (err, res) => {
  if (err) throw err;

  console.log(`MongoDB: active`);
});

app.listen(process.env.PORT,()=>{
    console.log(`Trabajando con puerto ${process.env.PORT}`);
});

//index
app.get("/", (req, res) => {
  res.status(200).json("Express Rest Server");
});

//Routes Api Rest
app.use(require("./routes/users"));