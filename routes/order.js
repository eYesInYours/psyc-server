"use strict";

const express = require("express");
const OrderHandler = require("../controllers/order/index");
const router = express.Router();
const Check = require("../middlewares/check");

router.get("/list", OrderHandler.list);
router.post("/create", OrderHandler.create);
router.post("/update", Check.checkAdmin, OrderHandler.update);
router.delete("/del/:id", Check.checkAdmin, OrderHandler.del);
router.post("/agreeOrReject", Check.checkTeacher, OrderHandler.agreeOrReject);

module.exports = router;
