const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");


app.post('/auth/login',(req,res)=>{

      let request = req.body;

      let email = request.email;
      let password = request.password;

      User.findOne({email},(e,user)=>{

        if(e) return res.status(500).json({  error:e })
 
         // @ts-ignore
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


 
app.post("/auth/google/login", async (req, res) => {


  try{

  //obtener info del token de google
  let ticket = await client.verifyIdToken({
    idToken: req.body.idtoken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  let payload = ticket.getPayload();

  let googleUser = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    google: true
  }

          User.findOne({ email:googleUser.email }, (e, user) => {

            if (e) return res.status(500).json({ error: e })

                  if (user){
                    //Si el usuario ya se ecuentra registardo

                    // @ts-ignore
                    if (!user.google){

                              //Si el usuario no esta registrado con google
                              return res.status(400).json({
                                error: "Esta cuenta no ha sido registrada con google."
                                })

                    }else{

                              //Creando token
                              let token = jwt.sign(
                                { data: user }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION }
                              );

                              //update img ?


                              return res.status(200).json({
                                success: {
                                  user,
                                  token
                                }
                              });

                    }

                  } else{
                    //Registrando al usuario si no existe

                    let user = new User({
                      name: googleUser.name,
                      email: googleUser.email,
                      img:googleUser.picture,
                      password: ":)",
                      google:true,
                      role: "USER"
                    });

                      user.save((e, userDB) => {

                                if (e) {
                                  return res.status(400).json(e);
                                }

                                let token = jwt.sign(
                                  { data: userDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION }
                                );

                                return res.status(200).json({
                                  success: {
                                    userDB,
                                    token
                                  }
                                });
                      });
                  }
        
        });

  }catch(e){
     return res.status(403).json({ error: e });
  }
});


module.exports = app;