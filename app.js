// import express from "express";
const express = require("express");
const db = require("./mongodb/db.js");
const config = require('./config/default.js');
// const config = require('config-lite');
const router = require('./routes/index.js');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const history = require("connect-history-api-fallback");
const chalk = require("chalk");

const app = express();

app.all("*", (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || "*";
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", "Express");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// const MongoStore = connectMongo(session);
app.use(cookieParser());
console.log('config', config.url)
app.use(
  session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    // store: new MongoStore({
    //   url: config.url,
    // }),
    store: MongoStore.create({
      mongoUrl: config.url
    })
  })
);

router(app);

app.use(history());
app.use(express.static("./public"));
app.listen(config.port, () => {
  console.log(chalk.green(`成功监听端口：${config.port}`));
});
