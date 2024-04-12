const orderModel = require("../../models/order/index");
const userModel = require("../../models/user/index");
const classroomModel = require("../../models/classroom/index");
const formidable = require("formidable");
const dtime = require("time-formater");

class Order {
  /* 查询预约订单 */
  async list(req, res, next) {
    const { pageNum = 1, pageSize = 20, teacherNickname = undefined, studentNickname = undefined } = req.query;
    const userId = req.headers.authorization;
    const user = await userModel.findOne({ id: userId });
    let filter = {};
    if (user.type == "STUDENT") {
      filter.stuId = userId;
    } else if (user.type == "TEACHER") {
      filter.teaId = userId;
    }
    if (teacherNickname){
      const user = await userModel.findOne({nickname:teacherNickname})
      filter.teaId = user?.id
    }else if(studentNickname){
      const user = await userModel.findOne({nickname:studentNickname})
      filter.stuId = user?.id
    }

    // 查询指定页码和指定数量的订单
    const total = await orderModel.countDocuments();
    const list = await orderModel
      .find(filter)
      .skip((pageNum * 1 - 1) * (pageSize * 1))
      .limit(pageSize * 1);

    // // 更新订单状态
    // 获取当前时间
    const currentTime = dtime().format("YYYY-MM-DD HH:mm:ss");
    // console.log("curr", currentTime);
    for (const order of list) {
      {
        const orderStartTime = order.times[0]; // 将订单开始时间转换为 Luxon DateTime 对象
        // console.log("order", orderStartTime);
        const orderEndTime = order.times[1]; // 计算订单结束时间

        // 以下状态不做修改
        const isConstant = order.status!='AGREE' && order.status!='REJECT' && order.status!='RATED'

        if (currentTime >= orderStartTime && currentTime <= orderEndTime) {
          // 如果当前时间在订单时间范围内，则更新订单状态为UNDERWAY
          order.status = "UNDERWAY";
        } else if (currentTime > orderEndTime && isConstant) {
          // 如果当前时间超过订单结束时间，则更新订单状态为FINISHED
          order.status = "FINISHED";
        }else if(currentTime < orderStartTime && isConstant){
          order.status = "APPLYING"
        }
        // 其他情况订单状态不变

        // if (!order.teacherDTO) {
          /* 查询教师 */
          const teacher = await userModel.findOne(
            { id: order.teaId },
            "-password"
          );
          const student = await userModel.findOne(
            { id: order.stuId },
            "-password"
          );

          console.log("teacher", teacher);

          // 将教师和学生信息挂载到订单对象上
          order.teacherDTO = teacher;
          order.studentDTO = student;
        // }

        // 保存修改后的订单状态
        await order.save();
      }
    }

    res.send({
      code: 0,
      data: {
        list,
        total,
      },
      message: "查询成功",
    });
  }

  /* 创建订单：预约 */
  /* 如果被拒绝后再发起预约，即重新生成一个订单 */
  async create(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let errObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (err) {
        errObj.message = "创建订单失败";
        errObj.data = err;
        return res.send(errObj);
      }
      const { id, times } = fields;
      if (!id) {
        errObj.message = "请选择教师";
        return res.send(errObj);
      } else if (!times.length || times.length != 2) {
        errObj.message = "请选择开始和结束时间";
        return res.send(errObj);
      }

      // 用户Id
      const userId = req.headers.authorization;
      // console.log("create", userId, id);

      // 查找订单
      const userOrder = await orderModel.findOne({
        stuId: userId,
        teaId: id,
        status: { $in: ["APPLYING", "AGREE"] },
      });
      if (userOrder) {
        errObj.message = "您已预约该教师，请勿重复预约";
        return res.send(errObj);
      }

      times.forEach((time, index) => {
        times[index] = dtime(time).format("YYYY-MM-DD HH:mm:ss");
        // console.log("time", time);
      });
      const order = await orderModel.create({
        teaId: id,
        stuId: userId,
        times,
        status: "APPLYING",
        createTime: dtime().format("YYYY-MM-DD HH:mm:ss"),
        id: Math.random().toString().slice(-5),
      });

      res.send({
        code: 0,
        message: "您的预约已提交，等待教师同意",
        data: null,
      });
    });
  }

  /* 教师同意或拒绝 */
  async agreeOrReject(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let errObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (err) {
        errObj.message = "操作失败";
        errObj.data = err;
        return res.send(errObj);
      }
      const { _id, status, rejectReason } = fields;
      if (!_id) {
        errObj.message = "请选择订单";
        return res.send(errObj);
      }

      const order = await orderModel.findById(_id);
      if(order.status != 'APPLYING'){
        errObj.message = "预约不在申请中，已不能处理";
        return res.send(errObj);
      }

      if (!rejectReason && status === "REJECT") {
        errObj.message = "请填写拒绝原因";
        return res.send(errObj);
      }


      order.status = status;
      if (status == "REJECT") order.rejectReason = rejectReason;
      await order.save();

      res.send({
        code: 0,
        message: "操作成功",
        data: order,
      });
    });
  }

  /* 学生取消订单 */
  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      await orderModel.findByIdAndUpdate(id, {
        status: 'CANCELED'
      });
      res.send({
        code: 0,
        message: "取消成功",
        data: null,
      });
    } catch (error) {
      res.send({
        code: 400,
        message: "取消失败",
        data: null,
      });
    }
  }

  /* 删除订单：ADMIN操作 */
  async del(req, res, next) {
    try {
      const { id } = req.params;
      console.log("del", id);
      await orderModel.findByIdAndDelete(id);
      res.send({
        code: 0,
        message: "删除成功",
        data: null,
      });
    } catch (error) {
      res.send({
        code: 400,
        message: "删除失败",
        data: null,
      });
    }
  }

  /* 更新订单：ADMIN操作 */
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
      const { id, status, rejectReason, times, _id } = fields;
      if (!id) {
        errObj.message = "请选择订单";
        return res.send(errObj);
      }

      const order = await orderModel.findById(_id);
      order.status = status;
      if (status == "REJECT") order.rejectReason = rejectReason;
      if (times.length){
        times.forEach((time, index) => {
          times[index] = dtime(time).format("YYYY-MM-DD HH:mm:ss");
          console.log("time", time);
        });
        order.times = times;
      }
      order.updateTime = dtime().format("YYYY-MM-DD HH:mm:ss");

      await order.save();

      res.send({
        code: 0,
        message: "更新成功",
        data: null,
      });
    });
  }
}

module.exports = new Order();
