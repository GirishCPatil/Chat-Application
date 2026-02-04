module.exports = (io, socket) => {

  // 🔹 Join a private room
  socket.on("groupmsg", ({ groupId }) => {
    socket.join(groupId);
    console.log(`${socket.user.name} joined room ${groupId}`);
  });

  // 🔹 Send private message
  socket.on("new_message", ({ groupId, text }) => {
    io.to(groupId).emit("receive_message", {
      text,
      user: socket.user.name,
      email: socket.user.email,
      time: new Date().toLocaleTimeString()
    });
  });

};
