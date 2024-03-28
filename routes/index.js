"use strict";

const user = require("./user");
const admin = require("./admin");
const classroom = require("./classroom");
const appoint = require("./appoint");
const order = require("../order");

module.exports = (app) => {
  app.use("/user", user);
  app.use("/admin", admin);
  app.use("/classroom", classroom);
  app.use("/appoint", appoint);
  app.use("/order", order);
};
