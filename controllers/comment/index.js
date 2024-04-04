"use strict";

const CommentModel = require("../../models/comment");
const formidable = require("formidable");
const dtime = require("time-formater");

class Comment{
    /* 查询老师的评论列表 */
    async list(req, res, next){
        const {pageNum=1, pageSize=15, teaId} = req.query
        const userId = req.headers.authorization;
        const errObj = {
            code: 400,
            data: null,
            message: ''
        }

        if(!teaId){
            errObj.message = '被评论者id不能为空'
            res.send(errObj)
        }else if(!userId){
            errObj.message = '评论者id不能为空'
            res.send(errObj)
        }

        // 查询教师所有的评论，越靠近当前查询时间的在列表中越靠前
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
            const { teaId, stuId, content, rate } = fields
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

            const comment = await CommentModel.create({teaId, stuId, content})

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

module.exports = Comment;