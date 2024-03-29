const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    id: Number,
    stuId: Number,
    studentDTO: Object,
    teacherDTO: Object,
    teaId: Number,
    times: Array,
    status: {type: String, default: 'APPLYING', enum: ['APPLYING', 'REJECT', 'AGREE', 'UNDERWAY', 'FINISHED']},
    rejectReason: String,
    createTime: String,     // 订单创建时间
})

orderSchema.index({id: 1})

const order = mongoose.model('order', orderSchema)

module.exports = order