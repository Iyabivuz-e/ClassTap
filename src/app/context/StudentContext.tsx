"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

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
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <StudentContext.Provider value={{ students, loading, error }}>
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
