const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  id: Number, // 教室主键
  location: { type: String, required: true }, // 教学楼地点
  createTime: String,
  updateTime: String,
  rooms: Array, // 教室
});

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
