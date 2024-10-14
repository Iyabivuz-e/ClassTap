// /app/api/notifications.ts

import { NextRequest } from "next/server";

interface AttendanceData {
  studentName: string;
  status: string;
  timestamp: number;
}

const clients: Array<WritableStreamDefaultWriter<unknown>> = []; // Use correct type for clients

export async function GET(request: NextRequest) {
  // Create a TransformStream to handle the readable/writable streams
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Add the writer to the clients list
  clients.push(writer);

  // Clean up on disconnect
  request.signal.addEventListener("abort", () => {
    const index = clients.indexOf(writer);
    if (index > -1) {
      clients.splice(index, 1);
    }
    writer.releaseLock(); // Release the lock on the writer
  });


  // Return a response with the readable stream and appropriate headers
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Function to broadcast attendance data
export function broadcastAttendance(data: AttendanceData) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    if (client) {
      client.write(message).catch((error) => {
        console.error("Failed to send message:", error);
      });
    }
  });
}

