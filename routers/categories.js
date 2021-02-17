const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get("/", (req, res) => {
  Category.find()
    .then((categoryList) => {
      res.status(200).json({
        status: 200,
        categoryList: categoryList,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

module.exports = router;
