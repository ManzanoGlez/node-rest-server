const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const _ = require("underscore");
const User = require('../models/User');
const { checkToken,isAdminRole} = require('../middleware/authentication');



app.get("/user", checkToken, (req, res) => {

  
 // return res.status(200).json(req.user._id);


  let since = Number(req.query.since) || 0;
  let perPage = Number(req.query.perPage) || 5;

  let filter = { state: true };

  User.find(filter, "name email role state google img")
    .skip(since)
    .limit(perPage)
    .exec((e, users) => {
      if (e) res.status(400).json(e);

      User.countDocuments(filter, (e, count) => {
        if (e) {
          return res.status(400).json(e);
        }

        return res.status(201).json({
          success: {
            data: users,
            totalRows: count,
          },
        });
      });
    });
});

app.post("/user",[checkToken,isAdminRole], (req, res) => {
  let request = req.body;

    let user = new User({
      name: request.name,
      email: request.email,
      password: bcrypt.hashSync(request.password, saltRounds),
      role: request.role,
    });

    user.save((e,userDB)=>{
        if (e){
            return res.status(400).json(e);
        }
      
        return res.status(201).json({ success: userDB });
    });
 });

app.put("/user/:id", [checkToken, isAdminRole], (req, res) => {
  let id = req.params.id;
  let request = _.pick(req.body, ["name", "email", "img", "role", "state"]);

  User.findByIdAndUpdate(
    id,
    request,
    { new: true, runValidators: true },
    (e, user) => {
      if (e) {
        return res.status(400).json(e);
      }

      return res.status(200).json({ success: user });
    }
  );
});

app.patch("/user", [checkToken, isAdminRole], (req, res) => {
  res.json("patch user");
});

app.delete("/user/:id", [checkToken, isAdminRole], (req, res) => {
  // Borrado literal

  //   let id = req.params.id;

  //   User.findByIdAndRemove(id, (e, user) => {
  //     if (e) return res.status(400).json(e);

  //     if (!user)
  //      return res.status(404).json({ error:{ message:"Usuario no encontrado" }});

  //     return res.status(200).json({ success: user });
  //   });

  //Borrado logico

  let id = req.params.id;

  User.findByIdAndUpdate(id, { state: false }, { new: true }, (e, user) => {
    if (e) {
      return res.status(400).json(e);
    }

    return res.status(200).json({ success: user });
  });
});






module.exports = app;