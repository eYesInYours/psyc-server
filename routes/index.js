"use strict";

const user = require("./user");
const admin = require("./admin");
const classroom = require("./classroom");
const appoint = require("./appoint");
const order = require("./order");
<<<<<<< HEAD
const util = require('./util')
=======
const comment = require('./comment')
>>>>>>> 5b8509df1643a96e501165089a3d6d699fa122b2

module.exports = (app) => {
  app.use("/user", user);
  app.use("/admin", admin);
  app.use("/classroom", classroom);
  app.use("/appoint", appoint);
  app.use("/order", order);
<<<<<<< HEAD
  app.use("/util", util);
=======
  app.use("/comment", comment);
>>>>>>> 5b8509df1643a96e501165089a3d6d699fa122b2
};
