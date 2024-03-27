const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  id: Number,
  location: { type: String, required: true },
  // 其他字段根据需要添加
  createTime: String,
  updateTime: String,
  rooms: Array
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
