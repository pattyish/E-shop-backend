const jwt = require("express-jwt");

require("dotenv").config();

function authJwt() {
  const api = process.env.API_URL;
  return jwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, playload, done) {
  if (!playload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
