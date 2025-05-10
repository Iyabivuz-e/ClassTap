"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Notification {
  studentName: string;
  status: string;
  timestamp: number;
}

const Notifications = ({ notifs }: { notifs: boolean }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io("http://localhost:4000", {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });

    // Set socket instance
    setSocket(socketInstance);

    // Listen for attendance notifications
    socketInstance.on("attendance-notification", (data: Notification) => {
      console.log("Received notification:", data);
      setNotifications((prev) => [...prev, data]);
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  socket?.emit("new-attendance", {
    studentName: "John Doe",
    status: "present",
    timestamp: Date.now(),
  });

  return (
    <div
      className={`${
        notifs ? "opacity-100 " : "opacity-0"
      } rounded-md -z-0 flex transition-all flex-col duration-400 bg-base-200 shadow-md h-[500px] w-[400px] max-sm:w-full absolute top-[70px] max-sm:right-0 right-3 px-2 overflow-scroll`}
    >
      <div className="flex justify-between gap-2 items-center w-full py-4">
        <h1 className="text-3xl max-sm:text-xl font-bold">Notifications</h1>
        <button className="btn btn-neutral px-2 py-1">Mark all read</button>
      </div>

      {notifications.length === 0 ? (
        <div className="">No notifications</div>
      ) : (
        <div className="w-full flex flex-col gap-3 shadow-md">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-base-100 px-3 py-2 rounded-md font-bold "
            >
              <div className="flex items-center justify-between gap-2">
                <p>{`${notification.studentName} is now ${notification.status}`}</p>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
              <p className="text-blue-500 text-sm font-normal">{`${new Date(
                notification.timestamp
              ).toLocaleTimeString()}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
