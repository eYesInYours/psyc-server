"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: Number,	// 用户主键
  nickname: String, // 昵称
  username: { type: String, required: true }, // 登陆账号
  password: { type: String, required: true }, // 密码
  type: { type: String, required: true }, // 登陆类型：ADMIN、TEACHER、STUDENT，只能为其中之一
  // 性别：男/女
  sex: { type: String, default: "", enum: ["MAN", "WOMAN", ""] },
  phone: String, // 手机号
  intro: String, // 简介
  createTime: String, // 用户创建时间
  updateTime: String, // 用户更新时间
  avatar: { type: String, default: "default.jpg" }, // 用户头像
  roles: [], // 用户权限：ADMIN、TEACHER、STUDENT，只能为其中之一
  officeIds: [], // 办公地点ID
  officeNames: [], // 办公地点名称
  officeCapacity: Number, // 办公地点可容纳人数
});

userSchema.index({ id: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
