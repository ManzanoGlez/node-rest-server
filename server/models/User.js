const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario."],
  },
  email: {
    type: String,
    index: true,
    required: [true, "El email es necesario."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum:{
      values:['USER','ADMIN'],
      message:'{VALUE} no es un rol valido.'
    }
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});


userSchema.methods.toJSON = function(){

let user = this;
let userObjet = user.toObject();
delete userObjet.password;

return userObjet;

}

userSchema.plugin(uniqueValidator,{
  message:'El {PATH} ya se encuenta registrado'
});


module.exports = mongoose.model("User",userSchema);