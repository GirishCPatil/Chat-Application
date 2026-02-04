const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
console.log("Socket Middleware Token:", token);
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, "secretKey"); // use your secret key
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user; // attach user to socket
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};
