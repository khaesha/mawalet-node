// environment variable
process.env.NODE_ENV = "development";

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bluebird = require("bluebird");

const config = require("./config/config");

const authRoutes = require("./routes/auth.route");
const cashFlowRoutes = require("./routes/cash-flow.route");
const categoryRoutes = require("./routes/category.route");
const summaryRouters = require("./routes/summary.route");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Hai sayang~~~");
  // res.status(200).json(global.gConfig);
});

app.use("/auth", authRoutes);
app.use("/cash-flow", cashFlowRoutes);
app.use("/category", categoryRoutes);
app.use("/summary", summaryRouters);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose.Promise = bluebird;
mongoose.set("debug", global.gConfig.db_debug);
mongoose
  .connect(
    `${global.gConfig.db_engine}://${global.gConfig.db_uri}:${
      global.gConfig.db_port
    }/${global.gConfig.db_name}`
  )
  .then(() => {
    app.listen(global.gConfig.node_port, () => {
      console.log(
        `${global.gConfig.app_name} listening on port ${
          global.gConfig.node_port
        }`
      );
    });
  })
  .catch(err => console.log(err));

module.exports = app;
