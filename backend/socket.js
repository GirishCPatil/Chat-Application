const { Server } = require("socket.io");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // 🔐 AUTH MIDDLEWARE
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, "secretKey");
      let user = await User.findByPk(decoded.userId)
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.user = user;
      console.log("Socket authenticated for user:", socket.user.dataValues.name);
      next();

    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.dataValues.name);

    socket.on("sendMessage", (message) => {
      socket.broadcast.emit("receiveMessage", {
        message:message,
        user: socket.user.dataValues.name,
        time: new Date().toLocaleTimeString()
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.userId);
    });
  });
};

module.exports = initSocket;
