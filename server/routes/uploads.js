const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const User = require("../models/User");
const Product = require("../models/Products");


// default options
// @ts-ignore
app.use(fileUpload({ useTempFiles: true, tempFileDir: "storage/tmp" }));

app.put('/upload/:type/:id', (req, res) =>{


    let id = req.params.id;
    let type = req.params.type;



    let validType = ["users", "products" ];

        if (validType.indexOf(type) < 0) {
          return res.status(400).json({
            error: `Los tipos permitidos validos son: '${validType.join(", ")}'`,
          });
        }

    // valida que existe archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                error:'No se ha selecciónado algún archivo.'
            });
        }

    //validar extenciones

        let fileInput = req.files.fileInput;
        // @ts-ignore
        let fileSplit = fileInput.name.split(".");
        let extFile = fileSplit[fileSplit.length -1].toLowerCase();

        let validExtensions = ['png','jpg','gif','jpeg'];

        if(validExtensions.indexOf(extFile) < 0){
            return res.status(400).json({ error:`Las extenciónes validas son: '${validExtensions.join(", ")}'` });
        }

    //Change filename

    let filename =  `${id}${new Date().getMilliseconds()}.${extFile}`; // o usar bcrypt

      // @ts-ignore
      fileInput.mv(`storage/${type}/${filename}`, (error) => {
        if (error) return res.status(500).json({ error });


        if (type === "users") {

            imgUser(id, res, filename);

        }else{

          imgProduct(id, res, filename);

        }
      
      });

});


function imgUser(id,res,filename) {

    User.findById(id,(e,user)=>{

        if (e) {
             deleteFile(filename, "users");
            return res.status(500).json(e);
        }

        if (!user) { 
            deleteFile(filename, "users");
            return res.status(400).json({error:"Usuario no encontrado."});
        }

        //checa que exista una imagen
        // @ts-ignore
       deleteFile(user.img,"users");

        // @ts-ignore
        user.img = filename;

        // @ts-ignore
        user.save((e,userDB)=>{
            if (e) { return res.status(500).json(e); }

            return res.status(200).json({ success: userDB });
        })

    })

}

// @ts-ignore
function imgProduct(id, res, filename) {


Product.findById(id, (e, product) => {
    
  if (e) {
    deleteFile(filename, "products");
    return res.status(500).json(e);
  }

  if (!product) {
    deleteFile(filename, "products");
    return res.status(400).json({ error: "Usuario no encontrado." });
  }

  //checa que exista una imagen
  // @ts-ignore
  deleteFile(product.img, "products");

  // @ts-ignore
  product.img = filename;

  // @ts-ignore
  product.save((e, productDB) => {
    if (e) {
      return res.status(500).json(e);
    }

    return res.status(200).json({ success: productDB });
  });
});


}

function deleteFile(img,type){
   // @ts-ignore
  let pathUrl = path.resolve(__dirname, `../../storage/${type}/${img}`);
        if (fs.existsSync(pathUrl)) {
            fs.unlinkSync(pathUrl);
        }

}

module.exports = app