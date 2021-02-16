const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");
const app = express();

app.use(bodyParser.json());
app.use(morgan("tiny"));
const api = process.env.API_URL;
app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "hair dresser",
    image: "some_url",
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  res.send(newProduct);
});

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop_database',
  })
  .then(() => {
    console.log("Database Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3002, () => {
  console.log(`server start running on http://localhost:3002`);
});
