'use strict';

const express = require('express')
const path = require('path')
const UtilHandler = require('../controllers/util/index') 
const router = express.Router();

// 配置静态文件服务，将上传的图片文件夹设置为静态文件目录
// router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
router.post('/upload', UtilHandler.upload);
 
module.exports = router;