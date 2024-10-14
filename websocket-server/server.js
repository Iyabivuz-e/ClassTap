import express from "express";
import { Server } from "socket.io";

const app = express();

// Create HTTP server
const server = app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("new-attendance", (data) => {
    console.log("Emitting attendance notification:", data); // Debug log
    io.emit("attendance-notification", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
