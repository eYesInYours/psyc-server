"use strict";

module.exports = {
  port: 8001,
  url: "mongodb://127.0.0.1:27017/psyc",
  session: {
    name: "admin",
    secret: "123456",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  },
};
