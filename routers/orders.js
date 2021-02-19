const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");

// Get Orders
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

// Post order
router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolve = await orderItemsIds;
  let orders = new Order({
    orderItems: orderItemsIdsResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  orders = await orders.save();
  if (!orders) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "The Order Not Created!!",
    });
  }
  res.status(200).json({
    status: 201,
    success: true,
    message: "Order Done Successful!!!",
    orders: orders,
  });
});
module.exports = router;
