const orderModel = require("../models/orderModel");
const formidable = require("formidable");
const dtime = require("time-formater");

class Order {
  /* 查询预约订单 */
  async list(req, res, next) {
    const { pageNum = 1, pageSize = 20, location = undefined } = req.query;
    let filter = {};
    if (location) filter.location = location;

    // 查询指定页码和指定数量的订单
    const total = await orderModel.countDocuments();
    const list = await orderModel
      .find(filter)
      .skip((pageNum * 1 - 1) * (pageSize * 1))
      .limit(pageSize * 1);

    // 更新订单状态
    const currentTime = DateTime.now(); // 获取当前时间
    for (const order of list) {
      const orderStartTime = DateTime.fromJSDate(order.dateTime); // 将订单开始时间转换为 Luxon DateTime 对象
      const orderEndTime = orderStartTime.plus({ hours: order.duration }); // 计算订单结束时间

      if (currentTime >= orderStartTime && currentTime <= orderEndTime) {
        // 如果当前时间在订单时间范围内，则更新订单状态为UNDERWAY
        order.status = "UNDERWAY";
      } else if (currentTime > orderEndTime) {
        // 如果当前时间超过订单结束时间，则更新订单状态为FINISHED
        order.status = "FINISHED";
      }
      // 其他情况订单状态不变

      // 保存修改后的订单状态
      await order.save();
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
      const { teaId, dateTime, duration } = fields;
      if (!teaId) {
        errObj.message = "请选择教师";
        return res.send(errObj);
      } else if (!dateTime || !duration) {
        errObj.message = "请选择开始或持续时间";
        return res.send(errObj);
      }

      const order = await orderModel.create({
        teaId,
        dateTime,
        duration,
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
      const { orderId, status, rejectReason } = fields;
      if (!orderId) {
        errObj.message = "请选择订单";
        return res.send(errObj);
      }

      if (!rejectReason && status === "REJECT") {
        errObj.message = "请填写拒绝原因";
        return res.send(errObj);
      }

      const order = await orderModel.findById(orderId);
      order.status = status;
      if (status == "REJECT") order.rejectReason = rejectReason;
      await order.save();

      res.send({
        code: 0,
        message: "操作成功",
        data: null,
      });
    });
  }

  /* 删除订单：ADMIN操作 */
  async del(req, res, next) {
    try {
      const { id } = req.query;
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
      const { id, status, rejectReason, dateTime, duration } = fields;
      if (!id) {
        errObj.message = "请选择订单";
        return res.send(errObj);
      }

      const order = await orderModel.findById(id);
      order.status = status;
      if (status == "REJECT") order.rejectReason = rejectReason;
      if(dateTime) order.dateTime = dateTime;
      if(duration) order.duration = duration;
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
