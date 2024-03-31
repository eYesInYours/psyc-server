"use strict";

const UserModel = require("../../models/user");
const formidable = require("formidable");
const dtime = require("time-formater");

class UserHandler {
  constructor() {
    this.login = this.login.bind(this);
  }

  /* 登陆 */
  async login(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log("fields", fields);
      const { username, password, type } = fields;

      if (!username || !password) {
        return res.send({
          message: "用户名或密码不能为空",
          code: 400,
          data: null,
        });
      }

      // 查询数据库中是否有同名的username
      const user = await UserModel.findOne({ username });
      const returnUser = await UserModel.findOne({ username }, "-password");
      if (!user) {
        const newUser = {
          username,
          password,
          // 生成五位数随机id
          id: Math.random().toString().slice(-5),
          createTime: dtime().format("YYYY-MM-DD HH:mm"),
          type,
          roles: [type],
        };
        await UserModel.create(newUser);

        return res.send({
          message: "注册成功",
          data: {
            token: newUser.id, // 模拟token
            user: returnUser,
          },
          code: 0,
        });
      } else if (user.password != password) {
        return res.send({
          message: "密码错误",
          code: 400,
          data: null,
        });
      } else if (user.type != type) {
        return res.send({
          message: "用户已存在，请选择正确的登陆类型",
          code: 400,
          data: null,
        });
      }

      res.send({
        message: "登陆成功",
        data: {
          token: user.id, // 模拟token
          user,
        },
        code: 0,
      });
    });
  }

  /* 获取用户信息 */
  async getUserInfo(req, res, next) {
    try {
      const { userId } = req.query;
      const user = await UserModel.findOne({ id: userId });
      res.send({
        message: "查询成功",
        data: user,
        code: 0,
      });
    } catch (error) {
      res.send({
        message: "查询失败",
        data: [],
        code: 400,
      });
    }
  }

  /* 更新用户信息 */
  async updateUserInfo(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        const {
          id,
          avatar,
          intro,
          nickname,
          officeIds,
          officeNames,
          officeCapacity,
          password,
          phone,
          sex,
        } = fields;
        await UserModel.updateOne(
          { id },
          {
            avatar,
            intro,
            nickname,
            officeIds,
            officeNames,
            officeCapacity,
            password,
            phone,
            sex,
          }
        );
        res.send({
          message: "更新成功",
          data: null,
          code: 0,
        });
      } catch (error) {
        console.log(error);
        res.send({
          message: "更新失败",
          data: null,
          code: 400,
        });
      }
    });
  }
}

module.exports = new UserHandler();
