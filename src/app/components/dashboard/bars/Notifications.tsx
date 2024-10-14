// Notifications.tsx

"use client";

import { useEffect, useState } from "react";

interface Notification {
  studentName: string;
  status: string;
  timestamp: number;
}

const Notifications = ({ notifs }: { notifs: boolean }) => {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/attendance/notifications");

    // Listen for incoming messages
   eventSource.onmessage = (event) => {
     console.log("Received message:", event.data); // Log the received message
     try {
       const data: Notification = JSON.parse(event.data);
       setNotifications((prev) => [...prev, data]);
     } catch (error) {
       console.error("Error parsing event data:", error);
     }
   };
    // Clean up when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);
  console.log("Student entered: ", notifications);

  
  return (
    <div
      className={`${
        notifs ? "opacity-100 " : "opacity-0"
      } rounded-md flex transition-all flex-col duration-400 bg-base-200 shadow-md h-[500px] w-[400px] max-sm:w-full absolute top-[70px] max-sm:right-0 right-3 px-2 overflow-scroll
      `}
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
