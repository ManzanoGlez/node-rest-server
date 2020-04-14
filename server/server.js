require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const PORT = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get("/", (req, res) => {
  res.json("Express Rest Server");
});


app.get("/user", (req, res)=> {
  res.json("get user");
});

app.post("/user", (req, res) => {

    let request = req.body;

    if(!request.name){
      res.status(400).json({
          msg:"El campo nombre es necesario."
      });
    }

 
    res.status(201).json({success: request});
});

app.put("/user/:id", (req, res) => {

    let id = req.params.id;

  res.json("put user " + id);
});

app.patch("/user", (req, res) => {
  res.json("patch user");
});

app.delete("/user", (req, res) => {
  res.json("delete user");
});




app.listen(process.env.PORT,()=>{
    console.log(`Trabajando con puerto ${PORT}`)
});
