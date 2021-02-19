const jwt = require("express-jwt");
require("dotenv").config();

function authJwt() {
  return jwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
  });
}

module.exports = authJwt;
