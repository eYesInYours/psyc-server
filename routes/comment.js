"use strict";

const express = require("express");
const CommentHandler = require("../controllers/comment/index");
const router = express.Router();
const Check = require("../middlewares/check");

router.get("/list", CommentHandler.list);
router.post("/post", Check.checkStudent, CommentHandler.post);
router.delete("/del/:_id",  CommentHandler.delete);

module.exports = router;
