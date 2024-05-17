const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionnaireSchema = new Schema({
  id: Number, // 订单主键
  // 姓名
  name: { type: String, maxlength: 20 },
  // 性别
  sex: { type: String, enum: ["MAN", "WOMAN"] },
  // 手机号
  phone: Number,
  question: Array,
//   // 平时关不关注心理健康方面信息
//   whetherPayAttention: { type: Number, enum: [0, 1] },
//   question: Object,
//   // 有没有去预约过心理咨询
//   whetherConsult: { type: Number, enum: [0, 1] },
//   // 愿不愿意尝试心理咨询
//   whetherTry: { type: Number, enum: [0, 1] },
  createTime: String, // 订单创建时间
});

questionnaireSchema.index({ id: 1 });

const questionnaire = mongoose.model("questionnaire", questionnaireSchema);

module.exports = questionnaire;
