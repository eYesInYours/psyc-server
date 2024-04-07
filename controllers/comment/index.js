"use strict";

const CommentModel = require("../../models/comment");
const UserModel = require("../../models/user");
const formidable = require("formidable");
const dtime = require("time-formater");

class Comment{
    /* 查询老师的评论列表 */
    async list(req, res, next){
        /* 
            TEACHER 查询对他所有的评论
            STUDENT 查询自己所有的评论
            ADMIN   查询教师所有的评论

        */
        const {pageNum=1, pageSize=15, id} = req.query
        const userId = req.headers.authorization;
        const errObj = {
            code: 400,
            data: null,
            message: ''
        }

        // if(!id){
        //     errObj.message = '被评论者id不能为空'
        //     res.send(errObj)
        // }
        if(!userId){
            errObj.message = '用户Id不能为空'
            res.send(errObj)
        }

        const USER = await UserModel.findOne({id: userId})
        const {type} = USER

        const filter = {}
        if(type === 'TEACHER'){
            filter.teaId = id
        }else if(type === 'STUDENT'){
            filter.stuId = id
        }else{
            filter.teaId = id
        }

        // 查询教师所有的评论，越靠近当前查询时间的在列表中越靠前
        const commentsList = await CommentModel.find(filter).skip((pageNum-1)*pageSize).limit(pageSize).sort({createTime: -1})
        
        res.send({
            code: 0,
            data: commentsList,
            message: '查询成功'
        })
    }

    /* 学生发布评论 */
    async post(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { teaId, content, rate } = fields
            const stuId = req.headers.authorization
            const errObj = {
                code: 400,
                data: null,
                message: ''
            }
            if(err){
                errObj.message = '评价失败'
                res.send(errObj)
            }

            if(!teaId){
                errObj.message = '被评论者id不能为空'
                res.send(errObj)
            }else if(!content){
                errObj.message = '评论内容不能为空'
                res.send(errObj)
            }else if(!rate){
                errObj.message = '评分不能为空'
                res.send(errObj)
            }

            const STUDENT = await UserModel.findOne({id: stuId}, "-password")
            const TEACHER = await UserModel.findOne({id: teaId}, "-password")

            const comment = await CommentModel.create({
                teaId, 
                stuId, 
                content,
                createTime: dtime().format('YYYY-MM-DD HH:mm:ss'),
                rate,
                studentDTO: STUDENT,
                teacherDTO: TEACHER
            })

            res.send({
                code: 0,
                data: comment,
                message: '评价成功'
            })

        })
    }

    /* 删除评论 */
    async delete(req, res, next){
        const {_id} = req.query
        const errObj = {
            code: 400,
            data: null,
            message: ''
        }

        if(!_id){
            errObj.message = '评价id不能为空'
            res.send(errObj)
        }

        const comment = await CommentModel.findByIdAndDelete(_id)

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

    /* 不设计修改评价功能，只允许发布 */
}

module.exports = new Comment();