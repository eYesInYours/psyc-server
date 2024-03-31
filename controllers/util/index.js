"use strict";

const formidable = require("formidable");
const dtime = require("time-formater");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

// 定义上传文件的存储路径
const uploadDir = path.join(__dirname, "../../uploads");

class UtilHandler {
  /* 文件上传 */
  async upload(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      const errObj = {
        code: 400,
        message: "",
        data: null,
      };
      if (err) {
        errObj.message = "图片上传失败";
        errObj.data = err;
        return res.send(errObj);
      }

      console.log(files, fields);

      // 如果上传的文件不存在
      const file = files["0[raw]"];
      if (files) {
        console.log("Upload directory:", files.raw[0].filepath, fields.name[0]);
        // 拼接文件的存储路径
        const filePath = path.join(uploadDir, fields.name[0]);

        // 将文件从临时目录移动到指定路径
        // fs.rename(files.raw[0].filepath, filePath, (err) => {
        //   if (err) {
        //     console.log(err)
        //     errObj.message = "文件保存失败";
        //     errObj.data = err;
        //     return res.send(errObj);
        //   }

        //   res.send({
        //     code: 0,
        //     data: filePath,
        //     message: "上传成功",
        //   });
        // });
        fse
          .move(files.raw[0].filepath, filePath, { overwrite: true })
          .then(() => {
            // 生成前端可访问的图片地址
            res.send({
              code: 0,
              data: `http://localhost:8001/uploads/${fields.name[0]}`,
              message: "上传成功",
            });
          })
          .catch((err) => {
            console.log(err);
            res.send({
              code: 1,
              message: "文件保存失败",
              data: err,
            });
          });
      }
    });
  }
}

module.exports = new UtilHandler();
