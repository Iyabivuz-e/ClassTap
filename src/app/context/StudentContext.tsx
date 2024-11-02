"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AttendanceStatus {
  date: string; // ISO date string
  status: string;
  student_id: string; // Added to match usage in the code
  studentId: string; // Added to match usage in the code
}

// interface Permissions{

// }
interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}
interface Directors {
  _id: string;
  fullname: string; // ISO date string
  email: string;
  password: string; // Added to match usage in the code
  schoolName: string; // Added to match usage in the code
  role: string; // Added to match usage in the code
  status: string; // Added to match usage in the code
  phoneNumber: number; // Added to match usage in the code
  permissions: string;
  address: Address;
  profilePicture: null; // Added to match usage in the code
}

interface Student {
  student_name: string;
  student_id: string;
  card_id: string;
  attendance_status: AttendanceStatus[]; // Array of attendance status
}

interface StudentContextType {
  students: Student[];
  filterClassAttendance: Student[];
  directors: Directors[];
  loading: boolean;
  error: string | null;
  director: Directors | null
  filteredStudents: Student[]; // New filtered students array
  filterStatus: string; // New filter status
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>; // Function to set filter status
  searchQuery: string; // New search query
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set search query
  fetchTodaysAttendance: () => Promise<void>; // Function to fetch today's attendance
  fetchAttendanceByClassAndCourse: (
    selectedClass: string,
    selectedCourse: string
  ) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(""); // Filter by status
  const [filterClassAttendance, setFilterClassAttendance] = useState<Student[]>(
    []
  ); // Filter by status
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [directors, setDirectors] = useState<Directors[]>([]); // State for today's attendance


  // Function to fetch directors' data from the API
  const fetchDirectors = async () => {
    try {
      const response = await fetch("/api/directors/get-all-directors");
      if (!response.ok) throw new Error("Failed to fetch directors");
      const data = await response.json();
      setDirectors(data.directors); // Assuming data structure has 'directors' key
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  const director = directors.length > 0 ? directors[0] : null;

  // ********FETCHING ALL STUDENTS AND TODAY'S ATTENDANCE IN ONE GO**********************
  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        // Fetch students
        const studentResponse = await fetch("/api/student/get-all-students");
        if (!studentResponse.ok) throw new Error("Failed to fetch students");
        const studentData = await studentResponse.json();

        // Fetch today's attendance
        const attendanceResponse = await fetch("/api/attendance/logs");
        if (!attendanceResponse.ok)
          throw new Error("Failed to fetch attendance");
        const attendanceData = await attendanceResponse.json();
        console.log("Attendance Object: ", attendanceData)

        // Merge attendance data with students
        // After fetching attendance data and merging
        const updatedStudents = studentData.students.map((student: Student) => {
          const todayAttendance = attendanceData.attendance.find(
            (attendance: AttendanceStatus) =>
              attendance.studentId.student_id === student.student_id
          );
          const today = new Date().toISOString().split("T")[0]; // Extract 'YYYY-MM-DD'

          if (todayAttendance) {
            // Replace the existing attendance for today or add a new one
            const filteredAttendance = student.attendance_status.filter(
              (status) =>
                new Date(status.date).toISOString().split("T")[0] !== today
            );

            return {
              ...student,
              attendance_status: [
                ...filteredAttendance, // Keep all previous records except today's duplicate
                {
                  date: today,
                  status: todayAttendance.status,
                  student_id: student.student_id,
                },
              ],
            };
          }

          return {
            ...student, // Return unchanged student if no attendance found for today
            attendance_status: student.attendance_status,
          };
        });

        setStudents(updatedStudents);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDirectors();
    fetchStudentsAndAttendance();
  }, []); // Only run once on component mount


  //****************FETCHING TODAY'S ATTENDANCE WITH CALLBACK TO AVOID DATA REDUNCANCY************* */
  const fetchTodaysAttendance = useCallback(async () => {
    try {
      const response = await fetch("/api/attendance/logs");
      if (!response.ok) throw new Error("Failed to fetch today's attendance");
      const data = await response.json();
      // Convert timestamps to Kigali timezone
      const formattedData = data.attendance.map((attendance) => ({
        ...attendance,
        date: new Date(attendance.timestamp).toLocaleString("en-US", {
          timeZone: "Africa/Kigali",
        }),
      }));

      return formattedData;

      // handle attendance data
    } catch (error) {
      // Cast 'error' to 'any' or handle properly
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [students]); // Add necessary dependencies

  // ***************Filter and search logic*********************
  const today = new Date().toISOString(); // Full date and time in ISO format
  console.log("TODAY: ", today);

  const filteredStudents = students.filter((student) => {
    // Check if filterStatus is "absent" and ensure at least one entry matches today's date and "absent" status
    const isStatusMatch =
      !filterStatus || // If no filter is applied, include all students
      (filterStatus === "absent" &&
        student.attendance_status.some((status) => {
          // Parse the attendance date, accommodating both formats
          const attendanceDateTime = new Date(status.date).toISOString();
          return (
            status.status === "absent" &&
            attendanceDateTime.startsWith(today.split("T")[0]) // Match today's date
          );
        })) ||
      (filterStatus !== "absent" &&
        student.attendance_status.some((status) => {
          const attendanceDateTime = new Date(status.date).toISOString(); // Normalize format
          return (
            status.status === filterStatus &&
            attendanceDateTime.startsWith(today.split("T")[0])
          ); // Ensure the date matches today
        }));

    // Check if the student's name, card ID, or student ID matches the search query
    const studentName = student.student_name || ""; // Default to an empty string if undefined
    const isNameMatch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.card_id.includes(searchQuery) ||
      student.student_id.includes(searchQuery);

    // Only include students who match both the filter and the search query
    return isStatusMatch && isNameMatch;

    
  });


  // ***************GETTING STUDENT'S ATTENDANCE BY THEIR CLASSES*********************
  const fetchAttendanceByClassAndCourse = async (
    selectedClass: string,
    selectedCourse: string
  ) => {
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedClass, selectedCourse }),
      });
      const data = await response.json();
      if (data.success) {
        // Use the attendance data
        setFilterClassAttendance(data.attendance);
        console.log(data.attendance);
      } else {
        data.attendance(data.message);
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        filteredStudents,
        filterStatus,
        director,
        directors,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        fetchTodaysAttendance,
        fetchAttendanceByClassAndCourse,
        filterClassAttendance,
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
