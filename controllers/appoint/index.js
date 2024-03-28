"use strict";

const UserModel = require("../../models/user");
const formidable = require("formidable");
const dtime = require("time-formater");

class Appoint {
  /* 查询老师列表 */
  async list(req, res, next) {
    const {
      pageNum = 1,
      pageSize = 20,
      username = undefined,
      phone = undefined,
    } = req.query;
    let filter = {
        type: 'TEACHER'
    };
    if (username) filter.username = username;

    console.log('filter', filter)
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

module.exports = new Appoint();