const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");

// Getting all Users
router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "There Is No Users Yet!!",
    });
  }
  res.status(200).json({
    status: 200,
    success: true,
    users: userList,
  });
});
// Getting User by Id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "User with This Id Is Not Found!!",
    });
  }
  res.status(200).json({
    status: 200,
    success: true,
    user: user,
  });
});
// Creating New User
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
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
      message: "The user Not Created!",
    });
  }
  res.status(201).json({
    status: 201,
    success: true,
    message: "User Created Successful!!",
    user: user,
  });
});

module.exports = router;
