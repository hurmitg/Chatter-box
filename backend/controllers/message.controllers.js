const asyncHandler = require("express-async-handler");
const ChatModel = require("../models/chat.model");
const MessageModel = require("../models/message.model");
const UserModel = require("../models/user.model");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).send("Invalid data passed");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await MessageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

module.exports = { sendMessage, allMessages };
