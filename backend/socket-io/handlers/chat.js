module.exports = (io, socket) => {
  socket.on("sendMessage", (text) => {
    io.emit("receiveMessage", {
      text,
      user: socket.user.name,
      time: new Date().toLocaleTimeString()
    });
  });
};
