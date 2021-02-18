const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

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
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Category For Given ID Was Not Found!",
    });
  }
  res.status(200).send(category);
});
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  });

  category = await category.save();
  if (!category) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "The Category Not Modified!!",
    });
  }
  res.status(200).send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon || category.icon,
    },
    { new: true }
  );
  if (!category) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "The Category Not Modified!!",
    });
  }
  res.status(200).send(category);
});

router.delete("/:id", async (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "The category is Deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "category does not Found!",
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
