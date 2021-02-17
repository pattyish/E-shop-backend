const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");

router.get("/", (req, res) => {
  Order.find()
    .then((orderList) => {
      res.status(200).json({
        status: 200,
        orderList: orderList,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

module.exports = router;
