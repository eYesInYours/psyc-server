"use strict";

const UserModel = require("../../models/user");

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
    console.log(req.query);
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
}

module.exports = new Admin();
