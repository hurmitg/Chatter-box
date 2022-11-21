const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const { chats } = require("./data/data");
const PORT = process.env.PORT || 8080;

const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// APIs

app.get("/", (req, res) => res.send("API is running"));

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`server started on port ${PORT}`.blue.italic.underline);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", async (socket) => {
  // console.log("connection established");

  socket.on("setup", async (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("yes", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (messageRecieved) => {
    var chat = messageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == messageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", messageRecieved);
    });
  });
});
