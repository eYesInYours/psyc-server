"use strict";

const ClassroomModel = require("../../models/classroom");
const formidable = require("formidable");
const dtime = require("time-formater");

class Classroom {
  /* 查询教室列表 */
  async list(req, res, next) {
    const { pageNum = 1, pageSize = 20, location = undefined } = req.query;
    let filter = {};
    if (location) filter.location = location;

    // 查询指定页码和指定数量的教室
    const total = await ClassroomModel.countDocuments();
    const list = await ClassroomModel.find(filter)
      .skip((pageNum * 1 - 1) * (pageSize * 1))
      .limit(pageSize * 1);
    res.send({
      code: 0,
      data: {
        list,
        total,
      },
      message: "查询成功",
    });
  }

  /* 删除指定ClassroomId的教室 */
  async del(req, res, next) {
    const { id } = req.params;
    const classroom = await ClassroomModel.findOne({id});

    let errObj = {
      code: 400,
      message: "",
      data: null,
    };

    if (!classroom) {
      errObj.message = "该教室不存在";
      return res.send(errObj);
    }

    const result = await ClassroomModel.findByIdAndDelete(classroom._id);
    if (result) {
      res.send({
        code: 0,
        message: "删除成功",
        data: null,
      });
    } else {
      res.send({
        code: 400,
        message: "删除失败",
        data: null,
      });
    }
  }

  /* 新增教室 */
  async add(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const { location, capacity, rooms } = fields;

      let sendObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (!location || !capacity) {
        sendObj.message = "名称或容量不能为空";
        return res.send(sendObj);
      }

      // 查询数据库中是否有同名的教室
      const existingClassroom = await ClassroomModel.findOne({ location });
      if (existingClassroom) {
        sendObj.message = "该教室已存在";
        return res.send(sendObj);
      }

      const newClassroom = {
        id: Math.random().toString().slice(-5),
        location,
        capacity,
        rooms,
        createTime: dtime().format("YYYY-MM-DD HH:mm"),
      };
      await ClassroomModel.create(newClassroom);

      res.send({
        code: 0,
        message: "新增成功",
        data: null,
      });
    });
  }

  /* 更新指定ClassroomId的教室 */
  async update(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const { _id, location, capacity, rooms } = fields;

      let sendObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (!_id) {
        sendObj.message = "未指定教室";
        return res.send(sendObj);
      }

      // 查询数据库中是否有指定id的教室
      const classroom = await ClassroomModel.findById(_id);
      if (!classroom) {
        sendObj.message = "该教室不存在";
        return res.send(sendObj);
      }

      // 更新指定字段
      classroom.location = location || classroom.location;
      classroom.capacity = capacity || classroom.capacity;
      classroom.updateTime = dtime().format("YYYY-MM-DD HH:mm");
      classroom.rooms = rooms;
      classroom.save();

      res.send({
        code: 0,
        message: "更新成功",
        data: null,
      });
    });
  }
}

module.exports = new Classroom();
