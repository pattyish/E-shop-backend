const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");

// Get Orders
router.get("/", (req, res) => {
  Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 })
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
// Get orders By Id
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (!order)
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Order of given ID is Not Found!",
    });
  res.status(200).json({
    status: 200,
    order: order,
  });
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

  const totalPrices = await Promise.all(
    orderItemsIdsResolve.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  let orders = new Order({
    orderItems: orderItemsIdsResolve,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
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

// Update Order
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "The Category Not Modified!!",
    });
  }
  res.status(200).send(order);
});
// Delete Order
router.delete("/:id", async (req, res) => {
  const order = Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({
          success: true,
          message: "The Order Deleted Successful!!!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "order does not Found!!",
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
// Get Total Sales
router.get("/get/totalSales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
  ])
  if (!totalSales) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "No Orders Have Been Made Yet!!"
    })
  }
  return res.status(200).json({
    status: 200,
    success: true,
    totalSales: totalSales.pop().totalSales
  })
})

// Count Orders
router.get("/get/count", async (req, res) => {
  const ordersCount = await Order.countDocuments((count) => count);
  if (!ordersCount)
    return res.status(404).json({
      status: 404,
      success: false,
      message: "There Is No Ordes in Stock Yet!",
    });
  res.status(200).json({
    status: 200,
    success: true,
    orderCount: ordersCount,
  });
});

// Get Orders By users
router.get("/get/userOrder/:userId", (req, res) => {
  Order.find({ user: req.params.userId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 })
    .then((userOrderList) => {
      res.status(200).json({
        status: 200,
        userOrderList: userOrderList,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});
module.exports = router;
