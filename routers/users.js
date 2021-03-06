const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
require("dotenv/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
router.post("/register", async (req, res) => {
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
// User Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "The User Not Found!",
    });
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      { expiresIn: "10w" }
    );
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login Successful!",
      user: user.email,
      token: token,
    });
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Password Or Email Is Not Correct!!",
    });
  }
});
// Count Users
router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments((count) => count);
  if (!userCount)
    return res.status(404).json({
      status: 404,
      success: false,
      message: "There Is No User Resgistered Yet!!!!",
    });
  res.status(200).json({
    status: 200,
    success: true,
    userCount: userCount,
  });
});
// Delete User
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "The user is Deleted!",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "user does not Found!",
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
