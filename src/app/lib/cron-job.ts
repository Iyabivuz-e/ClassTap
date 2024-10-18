import cron from "node-cron";
import { resetAttendanceForNewDay } from "./resetAttendance";

// Add initial log to confirm cron job registration
console.log("Scheduling attendance reset task...");

// Schedule task to run every day at 9:14 AM
cron.schedule(
  "59 23 * * *",
  async () => {
    console.log("Running attendance reset task...");
    try {
      await resetAttendanceForNewDay();
      console.log("Attendance reset task completed successfully.");
    } catch (error) {
      console.error("Error during attendance reset:", error);
    }
  },
  {
    timezone: "Africa/Kigali", // Ensure this timezone is supported in your environment
  }
);
