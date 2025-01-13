const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");

const server = app.listen(3000, () => {
  console.log("running on http://localhost:3000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`connected ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", (data) => {
    console.log(data, "sendData");
    socket.to(data.roomId).emit("sendMessage", data);
  });

  io.on("disconnect", (reason) => {
    console.log(`disconnected ${socket.id} ${reason}`);
  });
});
