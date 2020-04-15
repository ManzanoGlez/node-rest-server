require("./config/config");

const express = require("express");
const app = express();

//Global routes

app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
  console.log(`Trabajando con puerto ${process.env.PORT}`);
});

//DB conection

const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.URL_DB, (err, res) => {
  
  if (err) throw err;
  console.log(`MongoDB: active`);
});



