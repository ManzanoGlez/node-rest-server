const jwt = require("jsonwebtoken");


//===============================
//Check token in body=================

const checkToken = (req,res,next)=>{

let token = req.get("Authorization");
 
jwt.verify(token, process.env.SEED, (err, decoded) => {
  if (err) {
    return res.status(401).json({ error: {
       message: "Not authenticated",
       code:err
     }});
  }

    req.user = decoded.data;

    next();
});
}


//===============================
//Check token by param url
//===============================

const checkTokenURL = (req,res,next)=>{

let token = req.query.token;

jwt.verify(token, process.env.SEED, (err, decoded) => {
  if (err) {
    return res.status(401).json({ error: {
       message: "Not authenticated",
       code:err
     }});
  }

    req.user = decoded.data;

    next();
});
}



const isAdminRole = (req,res,next)=>{

    if(req.user.role === 'ADMIN'){
       next();
    } else{

    res.status(400).json({ error: "invalid access" });

    }

}


module.exports = {
  checkToken,
  isAdminRole,
  checkTokenURL,
};