"use strict";

const user = require("./user");
const admin = require("./admin");
const classroom = require("./classroom");

module.exports = (app) => {
  app.use("/user", user);
  app.use("/admin", admin);
  app.use("/classroom", classroom);
};
