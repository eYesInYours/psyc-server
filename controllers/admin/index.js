"use strict";

const UserModel = require("../../models/user");
const formidable = require("formidable");
const dtime = require("time-formater");

class Admin {
  /* 查询用户列表 */
  async list(req, res, next) {
    const {
      pageNum = 1,
      pageSize = 20,
      username = undefined,
      phone = undefined,
      type = undefined,
    } = req.query;
    let filter = {};
    if (username) filter.username = username;
    if (phone) filter.phone = phone;
    if (type) filter.type = type;

    // 查询指定页码和指定数量的用户
    const total = await UserModel.countDocuments();
    const list = await UserModel.find(filter, "-password")
      .skip((pageNum * 1 - 1) * (pageSize * 1))
      .limit(pageSize * 1);
    console.log(list);
    res.send({
      code: 0,
      data: {
        list,
        total,
      },
      message: "查询成功",
    });
  }

  /* 删除指定UserId的用户 */
  async del(req, res, next) {
    const { id } = req.params;
    const userId = req.headers.authorization;

    let errObj = {
      code: 400,
      message: "",
      data: null,
    };

    const assignUser = await UserModel.findOne({ id });
    console.log('assignUser', assignUser)
    if (userId == id) {
      errObj.message = "不能删除自己";
      return res.send(errObj);
    } else if (assignUser.type == "admin") {
      errObj.message = "不能删除管理员";
      return res.send(errObj);
    }

    const user = await UserModel.findByIdAndDelete(assignUser._id);
    if (user) {
      res.send({
        code: 0,
        message: "删除成功",
        data: null,
      });
    } else {
      res.send({
        code: 400,
        message: "该用户不存在",
        data: null,
      });
    }
  }

  /* 新增用户 */
  async add(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log("fields", fields);
      const { username, password, type, phone, intro, nickname, officeIds, officeNames, sex } = fields;

      let sendObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (!username || !password) {
        sendObj.message = "用户名或密码不能为空";
        return res.send(sendObj);
      }

      // 查询数据库中是否有同名的username
      const user = await UserModel.findOne({ username });
      const returnUser = await UserModel.findOne({ username }, "-password");
      if (!user) {
        const newUser = {
          nickname,
          username,
          password,
          // 生成五位数随机id
          id: Math.random().toString().slice(-5),
          createTime: dtime().format("YYYY-MM-DD HH:mm"),
          type,
          roles: [type],
          phone,
          sex,
          intro,
          officeIds,
          officeNames,
        };
        await UserModel.create(newUser);

        return res.send({
          message: "新增成功",
          data: {
            token: newUser.id, // 模拟token
            user: returnUser,
          },
          code: 0,
        });
      } else {
        sendObj.message = '该账号已存在'
        return res.send(sendObj);
      } 

    });
  }

  /* 更新指定userId用户 */
  async update(req, res, next) {
    const form = new formidable.IncomingForm();
    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.send({
            code: 400,
            message: "解析失败",
            data: null,
          });
        }
        console.log(fields);
        const { id, _id, nickname, phone, intro, officeIds, officeNames, sex } = fields;
        let updater = {
          updateTime: dtime().format("YYYY-MM-DD HH:mm"),
        };
        if (nickname) updater.nickname = nickname;
        if (phone) updater.phone = phone;
        if (intro) updater.intro = intro;
        if (officeIds) updater.officeIds = officeIds;
        if (officeNames) updater.officeNames = officeNames;
        if(sex) updater.sex = sex

        // 更新指定字段
        // 更新指定userId用户
        const user = await UserModel.findByIdAndUpdate(_id, updater);
        if (user) {
          return res.send({
            code: 0,
            message: "更新成功",
            data: null,
          });
        } else {
          return res.send({
            code: 400,
            message: "该用户不存在",
            data: null,
          });
        }
      });
    } catch (error) {
      res.send({
        code: 500,
        message: "服务器故障",
        data: null,
      });
      console.log(error);
      return;
    }
  }
}

module.exports = new Admin();
