const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
