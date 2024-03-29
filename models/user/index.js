'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	id: Number,
	nickname: String,	// 昵称
	username: {type: String, required: true},	// 登陆账号
	password: {type: String, required: true},
	type: {type: String, required: true},
	// sex只能取固定的值
	sex: {type: String, default: '', enum: ['MAN', 'WOMAN', '']},
	phone: String,
	intro: String,
	createTime: String,
	updateTime: String,
	avatar: {type: String, default: 'default.jpg'},
	roles: [],	// 权限
	// teacherOffice: String,		// 教师办公地点（教室）
	officeIds: [],
	officeNames: [],
	officeCapacity: Number,
})

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);


module.exports = User;
