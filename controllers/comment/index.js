"use strict";

const CommentModel = require("../../models/comment");
const orderModel = require("../../models/order");
const UserModel = require("../../models/user");
const formidable = require("formidable");
const dtime = require("time-formater");

class Comment {
  /* 查询老师的评论列表 */
  async list(req, res, next) {
    const {
      pageNum = 1,
      pageSize = 15,
      id,
      studentNickname,
      teacherNickname,
    } = req.query;
    const userId = req.headers.authorization;
    const errObj = {
      code: 400,
      data: null,
      message: "",
    };

    if (!userId) {
      errObj.message = "用户Id不能为空";
      res.send(errObj);
    }

    const USER = await UserModel.findOne({ id: userId });
    const { type } = USER;

    const filter = {};
    if (type === "TEACHER") {
      filter.teaId = userId;
      if (studentNickname){
        const STUDENT = await UserModel.findOne({ nickname: studentNickname });
        filter.stuId = STUDENT?.id;
      }
    } else if (type === "STUDENT") {
      filter.stuId = userId;
      if (teacherNickname){
        const TEACHER = await UserModel.findOne({ nickname: teacherNickname });
        filter.teaId = TEACHER?.id;
      }
    }

    console.log("comment list", filter);

    // 查询教师所有的评论，越靠近当前查询时间的在列表中越靠前
    const commentsList = await CommentModel.find(filter)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createTime: -1 });

    res.send({
      code: 0,
      data: {
        list: commentsList,
        total: commentsList.length,
      },
      message: "查询成功",
    });
  }

  /* 根据订单Id，或其他Id查询评论详情 */
  async detail(req, res, next) {
    const { orderId } = req.query;
    if (!orderId) {
      return res.send({
        code: 400,
        data: null,
        message: "订单不能为空",
      });
    }
    const comment = await CommentModel.findOne({ orderId });
    res.send({
      code: 0,
      data: comment,
      message: "查询成功",
    });
  }

  /* 学生发布评论 */
  async post(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const { _id, id, teaId, content, rate } = fields;
      const stuId = req.headers.authorization;
      const errObj = {
        code: 400,
        data: null,
        message: "",
      };
      if (err) {
        errObj.message = "评价失败";
        res.send(errObj);
      }

      if (!teaId) {
        errObj.message = "被评论者id不能为空";
        res.send(errObj);
      } else if (!content) {
        errObj.message = "评论内容不能为空";
        res.send(errObj);
      } else if (!rate) {
        errObj.message = "评分不能为空";
        res.send(errObj);
      }

      const STUDENT = await UserModel.findOne({ id: stuId }, "-password");
      const TEACHER = await UserModel.findOne({ id: teaId }, "-password");

      await orderModel.findByIdAndUpdate(_id, {
        status: "RATED",
      });

      const comment = await CommentModel.create({
        orderId: id,
        teaId,
        stuId,
        studentDTO: STUDENT,
        teacherDTO: TEACHER,
        content,
        createTime: dtime().format("YYYY-MM-DD HH:mm:ss"),
        rate,
        id: Math.random().toString().slice(-5),
      });

      res.send({
        code: 0,
        data: comment,
        message: "评价成功",
      });
    });
  }

  /* 删除评论 */
  async delete(req, res, next) {
    const { _id } = req.params;
    const errObj = {
      code: 400,
      data: null,
      message: "",
    };

    if (!_id) {
      errObj.message = "评价id不能为空";
      res.send(errObj);
    }

    const comment = await CommentModel.findByIdAndDelete(_id);

    if (comment) {
      res.send({
        code: 0,
        message: "评价删除成功",
        data: null,
      });
    } else {
      res.send({
        code: 400,
        message: "评价不存在",
        data: null,
      });
    }
  }

  async update(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let errObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (err) {
        errObj.message = "更新失败";
        errObj.data = err;
        return res.send(errObj);
      }
      const { id, _id, rate, content } = fields;
      if (!id) {
        errObj.message = "请选择订单";
        return res.send(errObj);
      }

      await CommentModel.findByIdAndUpdate(_id, {
        rate,
        content,
        updateTime: dtime().format("YYYY-MM-DD HH:mm:ss"),
      });

      res.send({
        code: 0,
        message: "更新成功",
        data: null,
      });
    });
  }
}

module.exports = new Comment();
