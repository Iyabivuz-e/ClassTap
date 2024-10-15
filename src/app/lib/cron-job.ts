import cron from "node-cron";
import { resetAttendanceForNewDay } from "../api/attendance/logs/route";

// Schedule task to run every day at 11:59 PM in your timezone (for example, Africa/Kigali)
cron.schedule(
  "59 23 * * *",
  async () => {
    console.log("Running attendance reset task...");
    await resetAttendanceForNewDay();
  },
  {
    timezone: "Africa/Kigali", 
  }
);
