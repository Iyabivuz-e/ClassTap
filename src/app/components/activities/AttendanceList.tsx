"use client";

import React from "react";
import { useStudentContext } from "@/app/context/StudentContext";

const AttendanceList = () => {
  const { students, error } = useStudentContext();

  // Function to format the time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
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
              <th></th>
              <th>Student Name</th>
              <th>Student Id</th>
              <th>Card Id</th>
              <th>Status</th>
              <th>In Time</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {students.map((student, index) => {
              const latestAttendance = student.attendance_status.reduce(
                (latest, current) => {
                  return new Date(current.date) > new Date(latest.date)
                    ? current
                    : latest;
                }
              );

              return (
                <tr key={index} className="bg-base-200">
                  <th>{index + 1}</th>
                  <td>{student.student_name}</td>
                  <td>{student.student_id}</td>
                  <td>{student.card_id}</td>
                  <td
                    className={
                      latestAttendance?.status === "present"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {latestAttendance ? latestAttendance.status : "Absent"}
                  </td>
                  <td>
                    {latestAttendance?.status === "present"
                      ? formatTime(latestAttendance.date)
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
