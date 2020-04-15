const express = require("express");
const app = express();

const Products = require('../models/Products');
const { checkToken } = require('../middleware/authentication');

 
app.get("/products", checkToken, (req, res) => {

    let since = Number(req.query.since) || 0;
    let perPage = Number(req.query.perPage) || 5;

    let filter = { avalible: true };

    Products.find(filter)
        .sort('name')
        .skip(since)
        .limit(perPage)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((e, product) => {
            if (e) res.status(400).json(e);

            Products.countDocuments(filter, (e, count) => {
                if (e) {
                    return res.status(400).json(e);
                }

                return res.status(201).json({
                    success: {
                        data: product,
                        totalRows: count,
                    },
                });
            });
        });
});

app.get("/products/search/:search", checkToken, (req, res) => {

  

    let since = Number(req.query.since) || 0;
    let perPage = Number(req.query.perPage) || 5;


    let search = req.params.search;

    let regex = new RegExp(search,'i')

    let filter = { 
        name: regex    };

    Products.find(filter)
        .sort('name')
        .skip(since)
        .limit(perPage)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((e, product) => {
            if (e) res.status(400).json(e);

            Products.countDocuments(filter, (e, count) => {
                if (e) {
                    return res.status(400).json(e);
                }

                return res.status(201).json({
                    success: {
                        data: product,
                        totalRows: count,
                    },
                });
            });
        });
});

app.get("/products/:id", checkToken, (req, res) => {

    let id = req.params.id;

    Products.
    findById(
        id,
        (e, product) => {
            if (e) {
                return res.status(500).json(e);
            }

            return res.status(200).json({ success: product });
        }
    )
    .populate('user', 'name email')
    .populate('category', 'description');


});

app.post("/products", [checkToken], (req, res) => {

    let request = req.body;

 
    let product = new Products({
        name: request.name,
        priceUni: request.priceUni,
        description: request.description,
        avalible: request.avalible,
        category: request.category,
        user: req.user._id,
    });

    product.save((e, productDB) => {

        if (e) {
            return res.status(500).json(e);
        }

        return res.status(201).json({
            success: productDB
        });

    });

});

app.put("/products/:id", [checkToken], (req, res) => {

    let id = req.params.id;
    let request = req.body;
    let data = { 
        name: request.name,
        priceUni: request.priceUni,
        description: request.description
        };

    Products.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true },
        (e, product) => {
            if (e) {
                return res.status(400).json(e);
            }

            return res.status(200).json({ success: product });
        }
    );
});

app.delete("/products/:id", [checkToken], (req, res) => {


    let id = req.params.id;

    Products.findByIdAndUpdate(id, { avalible: false }, { new: true }, (e, product) => {
        if (e) {
            return res.status(400).json(e);
        }

        return res.status(200).json({ success: product });
    });

});






module.exports = app;