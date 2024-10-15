"use client";

import { useStudentContext } from "@/app/context/StudentContext";
import React from "react";

const Statistics = () => {
  
  const { students } = useStudentContext();

  const presentStudents = students.filter((student) =>
    student.attendance_status.some(
      (StudentStatus) => StudentStatus.status === "present"
    )
  ).length;

  const lateStudents = students.filter(student => student.attendance_status.some(StudentStatus => StudentStatus.status === "late")).length
  const absentStudents = students.filter((student) =>
    student.attendance_status.every((status) => status.status === "absent")
  ).length;

  

  return (
    <div className="flex justify-center items-center gap-3 mt-12 px-5 max-sm:flex-col">
      <div className="bg-base-100 w-full border-1 border-opacity-5 shadow-md">
        <h1 className="p-3 bg-green-500 text-base-100 text-center text-xl font-semibold">
          Total Present
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">{presentStudents}</h1>
        </div>
      </div>
      {/* Late */}
      <div className="bg-base-100 w-full border-1 border-opacity-15 shadow-md">
        <h1 className="p-3 bg-yellow-500 text-base-100 text-center text-xl font-semibold">
          Total Late
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">{lateStudents}</h1>
        </div>
      </div>
      {/* Absent */}
      <div className="bg-base-100 w-full border-1 border-opacity-15 shadow-md">
        <h1 className="p-3  bg-red-500 text-base-100 text-center text-xl font-semibold">
          Total Absent
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">{absentStudents}</h1>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
