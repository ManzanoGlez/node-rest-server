const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { checkTokenURL } = require("../middleware/authentication");

app.get("/image/:type/:img", checkTokenURL, (req, res) => {
  // @ts-ignore

  let type = req.params.type;
  let img = req.params.img;

  let pathUrl = path.resolve(__dirname, `../../storage/${type}/${img}`);

  if (fs.existsSync(pathUrl)) {
    return res.sendFile(pathUrl);
  }

  return res.sendFile(path.resolve(__dirname, "../assets/no-img.jpg"));
});





module.exports = app;