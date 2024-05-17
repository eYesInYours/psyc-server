const QuestionnaireModel = require("../../models/questionnaire");
const formidable = require("formidable");
const dtime = require("time-formater");

class Questionnaire {
  /* 提交问卷 */
  async create(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let errObj = {
        message: "",
        code: 400,
        data: null,
      };
      if (err) {
        errObj.message = "创建问卷失败";
        errObj.data = err;
        return res.send(errObj);
      }

      const { name, sex, phone, question } = fields;

      await QuestionnaireModel.create({
        name,
        sex,
        phone,
        question,
        createTime: dtime().format("YYYY-MM-DD HH:mm:ss"),
        id: Math.random().toString().slice(-5),
      });

      res.send({
        code: 0,
        message: "问卷提交成功",
        data: null,
      });
    });
  }

  /* 查询列表 */
  async list(req, res, next) {
    const { pageNum = 1, pageSize = 20 } = req.query;
    let filter = {};

    // 查询指定页码和指定数量的教室
    const total = await QuestionnaireModel.countDocuments();
    const list = await QuestionnaireModel.find(filter)
      .skip((pageNum * 1 - 1) * (pageSize * 1))
      .limit(pageSize * 1);
    res.send({
      code: 0,
      data: {
        list,
        total,
      },
      message: "查询成功",
    });
  }
}

module.exports = new Questionnaire()