const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

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

module.exports = router;
