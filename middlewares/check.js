"use strict";

// import AdminModel from "../models/admin/admin";
const UserModel = require("../models/user/index");

class Check {
  constructor() {}
  async checkAdmin(req, res, next) {
    // 获取请求头中Header中的字段
    const userId = req.headers.authorization;
    if (!userId) {
      res.send({
        code: 401,
        message: "您还未登录",
        data: null,
      });
      return;
    } else {
      const admin = await UserModel.findOne({ id: userId, type: "ADMIN" });
      if (!admin) {
        res.send({
          code: 403,
          message: "您不是管理员，无权限操作",
          data: null,
        });
        return;
      }
    }
    next();
  }

  async checkTeacher(req, res, next) {
    // 获取请求头中Header中的字段
    const userId = req.headers.authorization;
    if (!userId) {
      res.send({
        code: 401,
        message: "您还未登录",
        data: null,
      });
      return;
    } else {
      const admin = await UserModel.findOne({ id: userId, type: "TEACHER" });
      if (!admin) {
        res.send({
          code: 403,
          message: "您不是教师，无权限操作",
          data: null,
        });
        return;
      }
    }
    next();
  }

  async checkStudent(req, res, next) {
    // 获取请求头中Header中的字段
    const userId = req.headers.authorization;
    if (!userId) {
      res.send({
        code: 401,
        message: "您还未登录",
        data: null,
      });
      return;
    } else {
      const admin = await UserModel.findOne({ id: userId, type: "STUDENT" });
      if (!admin) {
        res.send({
          code: 403,
          message: "您不是学生，无权限操作",
          data: null,
        });
        return;
      }
    }
    next();
  }

  async checkStudent(req, res, next) {
    // 获取请求头中Header中的字段
    const userId = req.headers.authorization;
    if (!userId) {
      res.send({
        code: 401,
        message: "您还未登录",
        data: null
      });
      return;
    } else {
      const admin = await UserModel.findOne({ id: userId, type: 'STUDENT' });
      if (!admin) {
        res.send({
          code: 403,
          message: "您不是学生，无权限操作",
          data: null
        });
        return;
      }
    }
    next();
  }


  async checkNotTeacher(req, res, next) {
    // 获取请求头中Header中的字段
    const userId = req.headers.authorization;
    if (!userId) {
      res.send({
        code: 401,
        message: "您还未登录",
        data: null
      });
      return;
    } else {
      const admin = await UserModel.findOne({ id: userId, type: 'TEACHER' });
      if (admin) {
        res.send({
          code: 403,
          message: "您是教师，无权限操作",
          data: null
        });
        return;
      }
    }
    next();
  }

}

module.exports = new Check();
