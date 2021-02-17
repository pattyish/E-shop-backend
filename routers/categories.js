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

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });

  category = await category.save();
  if (!category) {
    return res.status(404).send("The category cannot be created!!");
  }
  res.send(category);
});

module.exports = router;
