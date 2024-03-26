const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  id: Number,
  name: { type: String, required: true },
  // 关联User模型下type为TEACHER的用户，且Id为自定义ID
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联老师模型
  classroomId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true }, // 关联教室模型
  startTime: Date,
  endTime: Date
  // 其他字段根据需要添加
});

// 在课程模型中添加静态方法，用于检查教室在指定时间是否可用
courseSchema.statics.isClassroomAvailable = async function (
  classroomId,
  startTime,
  endTime
) {
  // 查询在指定时间范围内已经安排的课程数量
  const count = await this.countDocuments({
    classroomId,
    time: { $gte: startTime, $lt: endTime },
  });
  // 如果数量大于 0，则表示该教室在指定时间已经被占用
  return count === 0;
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;