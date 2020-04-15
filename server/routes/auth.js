const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


app.post('/auth/login',(req,res)=>{

      let request = req.body;

      let email = request.email;
      let password = request.password;

      User.findOne({email},(e,user)=>{

        if(e) return res.status(500).json({  error:e })
 
        if (!user || !bcrypt.compareSync(password, user.password)){
            return res.status(400).json({ error: "Usuario / contraseña no encontrado." });  
        }

        let token = jwt.sign(
          { data: user}, process.env.SEED,{ expiresIn: process.env.TOKEN_EXPIRATION }
        );

        return res.status(200).json({
        success: {
            user,
            token
        }
        });

      })
});



module.exports = app;