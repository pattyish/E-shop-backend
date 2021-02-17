const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", (req, res) => {
  Product.find()
    .then((productList) => {
      res.status(200).json({
        status: 200,
        productList: productList,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

router.post("/", (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((createProduct) => {
      res.status(201).json(createProduct);
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
        success: false,
      })
    );
});

module.exports = router;
