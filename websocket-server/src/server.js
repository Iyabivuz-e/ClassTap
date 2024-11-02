"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// Initialize express app
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
// Configuration
var PORT = process.env.SOCKET_PORT || 4000;
var CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// Initialize Socket.IO with CORS and error handling
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingTimeout: 60000, // How long to wait before considering connection closed
    pingInterval: 25000, // How often to ping the client
});
// Keep track of connected clients
var connectedClients = new Set();
// Middleware for logging
io.use(function (socket, next) {
    var clientIp = socket.handshake.address;
    console.log("New connection attempt from ".concat(clientIp));
    next();
});
// Handle socket connections
io.on("connection", function (socket) {
    try {
        connectedClients.add(socket.id);
        console.log("Client connected: ".concat(socket.id));
        console.log("Total connected clients: ".concat(connectedClients.size));
        // Handle new attendance notifications
        socket.on("new-attendance", function (data) {
            try {
                console.log("Received attendance notification:", data);
                // Validate the data
                if (!data.studentName || !data.status || !data.timestamp) {
                    throw new Error("Invalid attendance data format");
                }
                // Broadcast to all connected clients
                io.emit("attendance-notification", data);
                console.log("Notification broadcast successful");
            }
            catch (error) {
                console.error("Error processing attendance notification:", error);
                socket.emit("error", "Failed to process attendance notification");
            }
        });
        // Handle disconnection
        socket.on("disconnect", function (reason) {
            connectedClients.delete(socket.id);
            console.log("Client ".concat(socket.id, " disconnected. Reason: ").concat(reason));
            console.log("Remaining connected clients: ".concat(connectedClients.size));
        });
        // Handle errors
        socket.on("error", function (error) {
            console.error("Socket ".concat(socket.id, " error:"), error);
        });
    }
    catch (error) {
        console.error("Error in connection handler:", error);
    }
});
// Error handling for the HTTP server
httpServer.on("error", function (error) {
    console.error("Server error:", error);
});
// Start the server
httpServer.listen(PORT, function () {
    console.log("WebSocket server running on http://localhost:".concat(PORT));
});
// Graceful shutdown
process.on("SIGTERM", function () {
    console.log("SIGTERM received. Closing HTTP server...");
    httpServer.close(function () {
        console.log("HTTP server closed");
        process.exit(0);
    });
});
// Export for potential testing or external use
exports.default = { io: io, httpServer: httpServer };
