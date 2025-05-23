"use client";

import React, { useEffect } from "react";
import { useStudentContext } from "@/app/context/StudentContext";

const AttendanceList = () => {
  const { filteredStudents, error, fetchTodaysAttendance } =
    useStudentContext();

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      // Format time in Kigali timezone
      return new Date(date).toLocaleTimeString("en-US", {
        timeZone: "Africa/Kigali",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-7 -z-50">
      <h1>Attendance List</h1>
      <div className="overflow-x-auto mt-3">
        <table className="table">
          {/* Table header */}
          <thead>
            <tr>
              <th>No</th>
              <th>Student Name</th>
              <th>Student Id</th>
              <th>Card Id</th>
              <th>Status</th>
              <th>In Time</th>
            </tr>
          </thead>
          {/* Table body */}
          {filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <tbody>
              {filteredStudents.map((student, index) => {
                const defaultAttendanceStatus = {
                  date: "1970-01-01T00:00:00Z",
                  status: "Absent",
                };

                const latestAttendance = student.attendance_status.reduce(
                  (latest, current) => {
                    console.log(
                      "ATTENDANCE TIMEEEE: " + new Date(latest.date).getTime()
                    );

                    // Ensure both dates are compared in the same format
                    return new Date(current.date).getTime() >
                      new Date(latest.date).getTime()
                      ? current
                      : latest;
                  },
                  defaultAttendanceStatus
                );

                console.log("ATTENDANCE STATUS: " + latestAttendance.date);

                const attendanceStatus = latestAttendance
                  ? latestAttendance.status
                  : "Absent";

                return (
                  <tr key={index} className="bg-base-200">
                    <th>{index + 1}</th>
                    <td>{student.student_name}</td>
                    <td>{student.student_id}</td>
                    <td>{student.card_id}</td>
                    <td
                      className={
                        attendanceStatus === "present"
                          ? "text-green-500 font-semibold"
                          : attendanceStatus === "late"
                          ? "text-yellow-500 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {attendanceStatus}
                    </td>
                    <td>
                      {attendanceStatus === "present" ||
                      attendanceStatus === "late"
                        ? formatTime(latestAttendance.date)
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
