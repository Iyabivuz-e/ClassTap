"use client";

import React, { useState } from "react";
import { useStudentContext } from "@/app/context/StudentContext";
import axios from "axios";

const StudentList = () => {
  const { filteredStudents, error, overrideAttendance } = useStudentContext();
  const [manualEntryId, setManualEntryId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [myError, setMyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const handleManualEntry = async () => {
    setLoading(true);
    setMyError(null);

    if (!manualEntryId) {
      setMyError("No card ID entered.");
      setLoading(false);
      return;
    }

    const confirmMarkPresent = window.confirm(
      "Are you sure you want to mark this student as present?"
    );
    if (!confirmMarkPresent) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/attendance/logs", {
        cardId: manualEntryId,
      });

      if (response.status === 201) {
        console.log(`Marked student ${manualEntryId} as present`);
        setSuccessMessage(`Student marked as ${response.data.status} successfully!`);

        setTimeout(() => {
          setSuccessMessage(null); // Hide the message after 3 seconds
        }, 3000);
      } else {
        setMyError("Attendance already logged");
      }
    } catch (error: any) {
      setMyError(
        error?.response?.data?.message ||
          "Attending student failed. Please try again."
      );
    } finally {
      setLoading(false);
    }

    setManualEntryId("");
  };

  const handleOverrideAttendance = (studentId: string, newStatus: string) => {
    overrideAttendance(studentId, newStatus);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-7">
      <h2 className="mb-2">Manual Entry</h2>

      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed top-5 right-5 w-64 p-3 bg-green-500 text-white rounded shadow-lg z-50">
          <span>{successMessage}</span>
        </div>
      )}

      <div className="mt-5 mb-3 flex max-sm:flex-col w-full gap-2">
        <input
          type="text"
          placeholder="Enter student's card Id"
          value={manualEntryId}
          onChange={(e) => setManualEntryId(e.target.value)}
          className="input input-bordered mr-2"
        />
        {myError && (
          <div className="btn btn-error">
            <span>{myError}</span>
          </div>
        )}
        <button
          type="submit"
          onClick={handleManualEntry}
          className="btn cursor-pointer bg-base-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                ></path>
              </svg>
              <p>Mark as Present</p>
            </>
          ) : (
            "Mark as Present"
          )}
        </button>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Student Name</th>
              <th>Student Id</th>
              <th>Card Id</th>
              <th>Status</th>
              <th>In Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          {filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <tbody>
              {filteredStudents.map((student, index) => {
                const latestAttendance = student.attendance_status.reduce(
                  (latest, current) =>
                    new Date(current.date) > new Date(latest.date)
                      ? current
                      : latest
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
                      {latestAttendance?.status === "present" ||
                      latestAttendance?.status === "late"
                        ? formatTime(latestAttendance.date)
                        : "N/A"}
                    </td>
                    <td>
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
