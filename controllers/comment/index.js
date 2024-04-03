"use strict";

const CommentModel = require("../../models/comment");
const formidable = require("formidable");
const dtime = require("time-formater");

class Comment{
    /* 查询老师的评论列表 */
    async list(req, res, next){
        const {pageNum=1, pageSize=15, teaId} = req.query
        const errObj = {
            code: 400,
            data: null,
            message: ''
        }

        if(!teaId){
            errObj.message = '被评论者id不能为空'
            res.send(errObj)
        }

        // 查询所有teaId的评论，越靠近当前查询时间的在列表中越靠前
        const commentsList = await CommentModel.find({teaId}).skip((pageNum-1)*pageSize).limit(pageSize).sort({createTime: -1})
        
        res.send({
            code: 0,
            data: commentsList,
            message: '查询成功'
        })
    }

    /* 学生发布评论 */
    async post(){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            
        })
    }
}

module.exports = Comment;