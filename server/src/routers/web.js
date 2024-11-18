const express = require("express");
const chatRouter = require("./chatRouter");
const imageRouter = require("./imageRouter");

const web = express.Router();

web.use("/chat", chatRouter);
web.use("/image", imageRouter);

module.exports = web;
