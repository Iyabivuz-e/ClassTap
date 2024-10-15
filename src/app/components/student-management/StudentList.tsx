"use client";

import React, { useState } from "react";
import { useStudentContext } from "@/app/context/StudentContext";

const StudentList = () => {
  const { filteredStudents, error, overrideAttendance } = useStudentContext();
  const [manualEntryId, setManualEntryId] = useState<string>("");

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

  const handleManualEntry = () => {
    if (manualEntryId) {
      // Implement the logic to mark the student as present
      console.log(`Marking student ${manualEntryId} as present`);
      // Call your API or update context here
    }
  };

  const handleOverrideAttendance = (studentId: string, newStatus: string) => {
    // Call the context function to override attendance
    overrideAttendance(studentId, newStatus);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-7 -z-50">
      {/* Manual Entry Section */}
      <div className="mt-5 mb-3">
        <h2 className="mb-2">Manual Entry</h2>
        <input
          type="text"
          placeholder="Enter student's card Id"
          value={manualEntryId}
          onChange={(e) => setManualEntryId(e.target.value)}
          className="input input-bordered mr-2"
        />
        <button onClick={handleManualEntry} className="btn cursor-pointer bg-base-300 ">
          Mark as Present
        </button>
      </div>

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
              <th>Actions</th> {/* New Actions Column */}
            </tr>
          </thead>
          {/* Table body */}
          {filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <tbody>
              {filteredStudents.map((student, index) => {
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
                          : latestAttendance?.status === "late"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    >
                      {latestAttendance ? latestAttendance.status : "Absent"}
                    </td>
                    <td>
                      {latestAttendance?.status === "present"
                        ? formatTime(latestAttendance.date)
                        : latestAttendance?.status === "late"
                        ? formatTime(latestAttendance.date)
                        : "N/A"}
                    </td>
                    <td>
                      {/* Override Attendance Button */}
                      <button
                        onClick={() =>
                          handleOverrideAttendance(
                            student.student_id,
                            "present"
                          )
                        }
                        className="btn btn-warning btn-xs mr-1 cursor-pointer"
                      >
                        Mark Present
                      </button>
                      <button
                        onClick={() =>
                          handleOverrideAttendance(student.student_id, "absent")
                        }
                        className="btn btn-danger btn-xs cursor-pointer"
                      >
                        Mark Absent
                      </button>
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

export default StudentList;
