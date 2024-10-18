import React, { useState } from "react";
import { useStudentContext } from "@/app/context/StudentContext";
import StudentList from "./StudentList";
import Loader from "@/app/helpers/Loader";

const StudentManagement = () => {
  const {
    setFilterStatus,
    setSearchQuery,
    filterStatus,
    filteredStudents,
    loading,
  } = useStudentContext(); // Get filtered students from context
  const [allPresent, setAllPresent] = useState<boolean>(false);

  // No need to fetch students here since it's already done in the context API

  const markAllStudentsPresent = async () => {
    try {
      const response = await fetch("/api/attendance/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllPresent: true }), // Send the special flag
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error marking all students present:", error);
    }
  };


  const handleOverrideAttendance = (studentId: string, newStatus: string) => {
    // Implement API call to override attendance
    console.log(
      `Overriding attendance for ${studentId} with status ${newStatus}`
    );
  };

  if (loading === null) return <Loader />;


  return (
    <div className="flex flex-col p-5">
      <h1 className="text-center text-3xl font-semibold ">
        Student Management System
      </h1>
      <p className="text-center text-sm opacity-70 pb-12 mt-2">
        Manage students&apos; attendeance effortlessly
      </p>
      <div className="flex justify-between gap-2 items-center max-sm:flex-col max-sm:gap-3 max-sm:w-full">
        <div className="flex btn btn-outline gap-2 items-center cursor-default">
          <label className="flex gap-2">
            <input
              type="checkbox"
              name="mark-all"
              className="cursor-pointer"
              checked={allPresent}
              onChange={(e) => {
                setAllPresent(e.target.checked);
                if (e.target.checked) {
                  if (
                    confirm(
                      "Are you sure you want to mark all students?"
                    )
                  ) {
                    markAllStudentsPresent();
                  } else {
                    setAllPresent(false);
                  }
                }
              }}
            />
            Mark All Present
          </label>
        </div>
        <div className="join max-sm:justify-between max-sm:w-full max-sm:bg-base-200">
          <button
            className={`join-item btn ${
              filterStatus === "" ? "bg-gray-300" : ""
            }`}
            onClick={() => setFilterStatus("")}
          >
            All
          </button>
          <button
            className={`join-item btn text-green-500 ${
              filterStatus === "present"
                ? "bg-green-500 text-white"
                : "hover:bg-green-500 hover:text-base-100"
            }`}
            onClick={() => setFilterStatus("present")}
          >
            Present
          </button>
          <button
            className={`join-item btn text-yellow-500 ${
              filterStatus === "late"
                ? "bg-yellow-500 text-white"
                : "hover:bg-yellow-500 hover:text-base-100"
            }`}
            onClick={() => setFilterStatus("late")}
          >
            Late
          </button>
          <button
            className={`join-item btn text-red-500 ${
              filterStatus === "absent"
                ? "bg-red-500 text-white"
                : "hover:bg-red-500 hover:text-base-100"
            }`}
            onClick={() => setFilterStatus("absent")}
          >
            Absent
          </button>
        </div>

        <label className="input input-bordered flex items-center gap-2 max-sm:w-full">
          <input
            type="text"
            className="grow"
            placeholder="Search Student"
            onChange={(e) => setSearchQuery(e.target.value)} // Set search query
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      {/* Attendance List Component */}
      {/* Use filteredStudents instead of students to show filtered list */}
      <StudentList
        students={filteredStudents}
        onOverrideAttendance={handleOverrideAttendance}
      />
    </div>
  );
};

export default StudentManagement;
