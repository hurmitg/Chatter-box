const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
} = require("../controllers/chat.controllers");
const { protect } = require("../middlewares/auth.middleware");

const chat = express.Router();

chat.route("/").get(protect, fetchChats);
chat.route("/").post(protect, accessChat);

chat.route("/group").post(protect, createGroupChat);
chat.route("/rename").put(protect, renameGroupChat);
chat.route("/add").put(protect, addToGroupChat);
chat.route("/remove").put(protect, removeFromGroupChat);

module.exports = chat;
