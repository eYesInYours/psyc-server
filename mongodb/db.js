'use strict';

const mongoose = require('mongoose');
const config = require('../config/default');
const chalk = require('chalk');
mongoose.connect(config.url);
mongoose.Promise = global.Promise;

// 连接数据库成功后，执行回调函数，连接成功后，打印连接成功的提示信息。
const db = mongoose.connection;

db.once('open' ,() => {
	console.log(
    chalk.green('连接数据库成功')
  );
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    // mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

module.exports = db;