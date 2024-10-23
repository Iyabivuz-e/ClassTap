"use client";

import React, { useState, useEffect } from "react";
import { useStudentContext } from "@/app/context/StudentContext";
import ClassAttendanceTable from "./ClassAttendanceTable";

// Reusable Dropdown Component
interface DropdownProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect }) => (
  <div className="dropdown">
    <button className="btn m-1">{label}</button>
    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      {options.map((option) => (
        <li key={option}>
          <button onClick={() => onSelect(option)}>{option}</button>
        </li>
      ))}
    </ul>
  </div>
);

const ClassAttendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const {
    fetchAttendanceByClassAndCourse,
    loading,
    error,
  } = useStudentContext();

  useEffect(() => {
    if (selectedClass && selectedCourse) {
      fetchAttendanceByClassAndCourse(selectedClass, selectedCourse);
    }
  }, [selectedClass, selectedCourse]);

  // Extract attendance status and formatted time
  const extractAttendanceDetails = (attendance: {
    attendance_status: { date: string; status: string }[];
  }) => {
    return attendance.attendance_status.map((item) => ({
      status: item.status,
      time: new Date(item.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Extract only hour and minute
    }));
  };

  const classOptions = ["Level 3", "Level 4", "Level 5"];
  const courseOptions = ["Software", "Networking", "Business"];

  if (loading) {
    return <div>Loading attendance...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-6 flex flex-col justify-center">
      {/* Class and Course Dropdowns */}
      <div className="flex space-x-4">
        {classOptions.map((classOption) => (
          <Dropdown
            key={classOption}
            label={classOption}
            options={courseOptions}
            onSelect={(course) => {
              setSelectedClass(classOption);
              setSelectedCourse(course);
            }}
          />
        ))}
      </div>

      {/* Attendance Table */}
      <table className="table mt-5">
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
        <ClassAttendanceTable
          extractAttendanceDetails={extractAttendanceDetails}
        />
      </table>
    </div>
  );
};

export default ClassAttendance;
