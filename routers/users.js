const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

// Getting all Users
router.get("/", async (req, res) => {
  const userList = await User.find();
  if (!userList) {
    res.status(500).json({
      status: 500,
      success: false,
    });
  }
  res.status(200).json({
    status: 200,
    success: true,
    users: userList,
  });
});

// Creating New User
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();
  if (!user) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "The user Not Modified!!",
    });
  }
  res.status(201).json({
    status: 201,
    success: true,
    user: user,
  });
});

module.exports = router;
