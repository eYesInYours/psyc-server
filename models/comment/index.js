'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    id: Number,
    teaId: Number,      // 被评论者
    stuId: Number,      // 评论者
    studentDTO: Object, // 评论者信息
    teacherDTO: Object, // 被评论者信息
    createTime: String,
    updateTime: String,
    // 限制内容不超过500字
    content: {type: String, maxlength: 500},
    // 限定只有1-5
    rate: {type: Number, min: 1, max: 5}
})

commentSchema.index({id: 1});

const Comment = mongoose.model('Comment', commentSchema);


module.exports = Comment;
