const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", (req, res) => {
  Product.find().select("name image countInStock")
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
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Product of given ID is Not Found!",
    });
  res.status(200).json({
    status: 200,
    success: true,
    product,
  });
});
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category)
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid Category",
    });

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
  if (!product)
    return res.status(500).json({
      error: err,
      success: false,
    });
  res.status(201).json({
    status: 201,
    success: true,
    product: product,
  });
});

module.exports = router;
