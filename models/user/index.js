'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	id: Number,
	nickname: String,	// 昵称
	username: {type: String, required: true},	// 登陆账号
	password: {type: String, required: true},
	type: {type: String, required: true},
	phone: String,
	intro: String,
	createTime: String,
	updateTime: String,
	avatar: {type: String, default: 'default.jpg'},
	roles: [],	// 权限
	// teacherOffice: String,		// 教师办公地点（教室）
	officeIds: [],
	officeNames: []
})

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);


module.exports = User;
