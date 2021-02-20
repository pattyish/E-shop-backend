const express = require("express");
const app = express();
require("dotenv/config");
const api = process.env.API_URL;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error.handle");

app.use(cors());
app.options("*", cors());

/// routers
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");
const productRoutes = require("./routers/product");
const categoriesRoutes = require("./routers/categories");

// middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true}))
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

app.use(`${api}/products`, productRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop_database",
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
