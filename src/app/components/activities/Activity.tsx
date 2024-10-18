"use client";

import React, { useEffect, useState } from "react";
import Students from "./Students";
import Statistics from "./Statistics";
import Loader from "@/app/helpers/Loader";
import { useStudentContext } from "@/app/context/StudentContext";
import { format } from "date-fns"; // For date formatting
import { Attendance } from "@/app/lib/models/Attendances"; // Adjust import based on your structure

const Activity: React.FC = () => {
  const { loading } = useStudentContext();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
    null
  );

  useEffect(() => {
    // Get the current date and format it
    const today = new Date();
    const formattedDate = format(today, "EEEE, MMM d, yyyy"); // e.g., "Friday, Oct 11, 2024"
    setCurrentDate(formattedDate);

    // Fetch the current day's attendance data from the backend
    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/attendance/logs"); // Use the updated API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data: Attendance[] = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  if (loading || attendanceData === null) return <Loader />;

  return (
    <div className="w-full">
      <div className="text-center mt-8">
        <h1 className="text-3xl font-semibold px-1 max-sm:text-2xl">
          {currentDate} Active attendances
        </h1>
      </div>

      {/* Total of present students, late, and absent */}
      <Statistics attendanceData={attendanceData} />

      {/* Students list */}
      <Students attendanceData={attendanceData} />
    </div>
  );
};

export default Activity;
