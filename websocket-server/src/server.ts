import express from "express";
import { createServer } from "http";
import { Server, Socket, DefaultEventsMap } from "socket.io";
// import {  } from "socket.io";

// import { DefaultEventsMap } from "socket.io/dist/typed-events";

// Define types for our notification data
interface AttendanceNotification {
  studentName: string;
  status: string;
  timestamp: number;
}

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Configuration
const PORT = process.env.SOCKET_PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Initialize Socket.IO with CORS and error handling
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // How long to wait before considering connection closed
  pingInterval: 25000, // How often to ping the client
});

// Keep track of connected clients
const connectedClients = new Set<string>();

// Middleware for logging
io.use((socket, next) => {
  const clientIp = socket.handshake.address;
  console.log(`New connection attempt from ${clientIp}`);
  next();
});

// Handle socket connections
io.on("connection", (socket: Socket<DefaultEventsMap>) => {
  try {
    connectedClients.add(socket.id);
    console.log(`Client connected: ${socket.id}`);
    console.log(`Total connected clients: ${connectedClients.size}`);

    // Handle new attendance notifications
    socket.on("new-attendance", (data: AttendanceNotification) => {
      try {
        console.log("Received attendance notification:", data);

        // Validate the data
        if (!data.studentName || !data.status || !data.timestamp) {
          throw new Error("Invalid attendance data format");
        }

        // Broadcast to all connected clients
        io.emit("attendance-notification", data);
        console.log("Notification broadcast successful");
      } catch (error) {
        console.error("Error processing attendance notification:", error);
        socket.emit("error", "Failed to process attendance notification");
      }
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      connectedClients.delete(socket.id);
      console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
      console.log(`Remaining connected clients: ${connectedClients.size}`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket ${socket.id} error:`, error);
    });
  } catch (error) {
    console.error("Error in connection handler:", error);
  }
});

// Error handling for the HTTP server
httpServer.on("error", (error) => {
  console.error("Server error:", error);
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing HTTP server...");
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Export for potential testing or external use
export default { io, httpServer };
