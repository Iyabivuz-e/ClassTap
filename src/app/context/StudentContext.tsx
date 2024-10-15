"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import StudentManagement from "../components/student-management/StudentManagement";

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

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  filteredStudents: Student[]; // New filtered students array
  filterStatus: string; // New filter status
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>; // Function to set filter status
  searchQuery: string; // New search query
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set search query
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(""); // Filter by status
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/student/get-all-students");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data.students);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter and search logic
  const filteredStudents = students.filter((student) => {
    const isStatusMatch =
      !filterStatus ||
      student.attendance_status.some(
        (status) => status.status === filterStatus
      );
    const isNameMatch =
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.card_id.includes(searchQuery) ||
      student.student_id.includes(searchQuery);

    return isStatusMatch && isNameMatch;
  });

  //getting all students
  

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        filteredStudents, // Expose the filtered students
        filterStatus, // Current filter status
        setFilterStatus, // Function to update filter status
        searchQuery, // Current search query
        setSearchQuery, // Function to update search query
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use the StudentContext
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};
