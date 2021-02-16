const express = require("express");
require("dotenv/config");
const app = express();

const api = process.env.API_URL;
app.get(`${api}/`, (req, res) => {
  res.send("hello api");
});

app.listen(3002, () => {
  console.log(`server start running on http://localhost:3002`);
});
