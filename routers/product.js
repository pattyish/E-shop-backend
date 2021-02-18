const express = require("express");
const { Category } = require("../models/category");
const { Product } = require("../models/product");
const router = express.Router();
const mongoose = require("mongoose");

// Get All Products From Database
router.get("/", (req, res) => {
  Product.find()
    .populate("category")
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

// Get product by Id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
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

// Create new Product
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
// Update Product Info
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Invalid Product Id!",
    });
  }
  const category = await Category.findById(req.body.category);
  if (!category)
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid Category",
    });
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true }
  );
  if (!product) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "The Product Not Modified!!",
    });
  }
  res.status(200).json({
    status: 200,
    success: true,
    message: "Product Updated Successful",
    product: product,
  });
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "The product is Deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "product does not Found!",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        error: error,
      });
    });
});
module.exports = router;
