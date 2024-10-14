"use client";

import React, { useEffect, useState } from "react";

interface AttendanceStatus {
  date: string; // ISO date string
  status: string;
}

interface Student {
  student_name: string;
  student_id: string;
  card_id: string;
  attendance_status: AttendanceStatus[]; // Array of attendance status
}

const AttendanceList = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/student/get-all-students");
      const data = await response.json();
      setStudents(data.students);
    };

    fetchStudents();
  }, []);

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
            {students.map((student, index) => (
              <tr key={index} className="bg-base-200">
                <th>{index + 1}</th>
                <td>{student.student_name}</td>
                <td>{student.student_id}</td>
                <td>{student.card_id}</td>
                <td className={`${student.attendance_status[0].status === "present"? "text-green-500": "text-red-500"}`}>
                  {student.attendance_status.length > 0
                    ? student.attendance_status[0].status
                    : "Absent"}
                </td>
                <td>
                  {student.attendance_status.length > 0
                    ? formatTime(student.attendance_status[0].date)
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;

// "text-green-500"
