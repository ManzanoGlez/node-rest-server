const express = require("express");
const app = express();

const Category = require('../models/Categories');
const { checkToken,isAdminRole } = require('../middleware/authentication');



app.get("/category", checkToken, (req, res) => {

    let since = Number(req.query.since) || 0;
    let perPage = Number(req.query.perPage) || 5;

    let filter = {};

    Category.find(filter)
        .sort('description')
        .skip(since)
        .limit(perPage)
        .populate('user','name email')
        .exec((e, categories) => {
            if (e) res.status(400).json(e);

            Category.countDocuments(filter, (e, count) => {
                if (e) {
                    return res.status(400).json(e);
                }

                return res.status(201).json({
                    success: {
                        data: categories,
                        totalRows: count,
                    },
                });
            });
        });
});

app.get("/category/:category_id", checkToken, (req, res) => {

    let category_id = req.params.category_id;
 
    Category.findById(
        category_id,
        (e, category) => {
            if (e) {
                return res.status(500).json(e);
            }

            return res.status(200).json({ success: category });
        }
    ).populate('user', 'name email');

     
});

app.post("/category", [checkToken], (req, res) => { 

    let request = req.body;

    let category = new Category({
        description: request.description,
        user: req.user._id,
     });

    category.save((e, categoryDB) => {

        if (e) {
            return res.status(500).json(e);
        }

        return res.status(201).json({
            success: categoryDB
        });

});

});

app.put("/category/:category_id", [checkToken], (req, res) => {
    let category_id = req.params.category_id;
    let request = {description :req.body.description};

    Category.findByIdAndUpdate(
        category_id,
        request,
        { new: true, runValidators: true },
        (e, category) => {
            if (e) {
                return res.status(400).json(e);
            }

            return res.status(200).json({ success: category });
        }
    );
});

app.delete("/category/:id", [checkToken, isAdminRole], (req, res) => {

      let id = req.params.id;

      Category.findByIdAndRemove(id, (e, category) => {
         if (e) return res.status(400).json(e);

          if (!category)
         return res.status(404).json({ error:{ message:"Categoria no encontrada" }});

          return res.status(200).json({ success: category });
      });

});






module.exports = app;