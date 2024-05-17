const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  id: Number, // 订单主键
  stuId: Number, // 预约者（学生）主键
  studentDTO: Object, // 预约者（学生）信息
  teacherDTO: Object, // 被预约者（教师）主键
  teaId: Number, // 被预约者（教师）信息
  times: [Date, Date], // 预约时间Array
  // 订单状态：申请中、拒绝预约、接收预约、预约进行中、预约已完成、预约已取消、预约已评价
  status: {
    type: String,
    default: "APPLYING",
    enum: [
      "APPLYING",
      "REJECT",
      "AGREE",
      "UNDERWAY",
      "FINISHED",
      "CANCELED",
      "RATED",
    ],
  },
  rejectReason: String, // 教师拒绝接受该预约订单的理由
  createTime: String, // 订单创建时间
  updateTime: String, // 订单创建时间
});

orderSchema.index({ id: 1 });

const order = mongoose.model("order", orderSchema);

module.exports = order;
