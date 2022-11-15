const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/message.controllers");
const { protect } = require("../middlewares/auth.middleware");

const message = express.Router();

message.route("/").post(protect, sendMessage);
message.route("/:chatId").get(protect, allMessages);

module.exports = message;
