module.exports = (io, socket) => {

  // 🔹 Join a private room
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`${socket.user.name} joined room ${roomId}`);
  });

  // 🔹 Send private message
  socket.on("new_message", ({ roomId, text }) => {
    io.to(roomId).emit("receive_message", {
      text,
      user: socket.user.name,
      email: socket.user.email,
      time: new Date().toLocaleTimeString()
    });
  });

};
