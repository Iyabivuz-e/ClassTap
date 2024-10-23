import { useStudentContext } from "@/app/context/StudentContext";
import React from "react";

const ClassAttendanceTable = ({ extractAttendanceDetails }) => {
  const { filterClassAttendance } = useStudentContext();
  return (
    <>
      <tbody>
        {filterClassAttendance.length === 0 ? (
          <tr>
            <td colSpan={6}>No students found for the selected criteria</td>
          </tr>
          
        ) : (
          filterClassAttendance.map((student, index) => {
            const attendanceDetails = extractAttendanceDetails(student);

            return (
              <tr key={index} className="bg-base-200">
                <th>{index + 1}</th>
                <td>{student.student_name}</td>
                <td>{student.student_id}</td>
                <td>{student.card_id || "No card"}</td>
                <td
                  className={
                    attendanceDetails[0]?.status === "present"
                      ? "text-green-500 font-semibold"
                      : attendanceDetails[0]?.status === "late"
                      ? "text-yellow-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {attendanceDetails[0]?.status || "Absent"}
                </td>
                <td>{attendanceDetails[0]?.time || "N/A"}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </>
  );
};

export default ClassAttendanceTable;
