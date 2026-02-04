const { Server } = require("socket.io");
const socketMiddleware = require("./middleware");
const chatHandler = require("./handlers/chat");
const personalChatHandler = require("./handlers/personal_chat");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  //  Socket middleware (auth)
  io.use(socketMiddleware);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.name);

    // Register event handlers
    chatHandler(io, socket);
     personalChatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.name);
    });
  });
};
