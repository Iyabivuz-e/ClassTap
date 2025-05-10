"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./bars/Navbar";
import Sidebar from "./bars/Sidebar";
import Head from "next/head";
import Activity from "../activities/Activity";
import StudentManagement from "../student-management/StudentManagement";
import Profile from "../profile/Profile";
import { usePathname } from "next/navigation";
import Classes from "../classes/Classes";
import AddStudentPage from "../add-students/AddStudents";

const Dashboard = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.includes("dashboard")) {
      document.title = "Dashboard - ClassTap";
    } else {
      document.title = "ClassTap";
    }
  }, [pathname]);

  const pageTitle = "Dashboard - Attendance.";

  const [clicked, setClicked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebar-toggled");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  const [renderComp, setRenderComp] = useState<string>("dashboard"); // State to manage rendered component

  // Handle toggle for sidebar
  const handleToggle = () => {
    const newState = !clicked;
    setClicked(newState);
    localStorage.setItem("sidebar-toggled", JSON.stringify(newState));
  };

  // Function to render components based on state
  const renderComponent = () => {
    switch (renderComp) {
      case "dashboard":
        return <Activity />;
      case "students":
        return <StudentManagement />;
      case "profile":
        return <Profile />; // Profile component is rendered here
      case "classes":
        return <Classes />;
      case "add-student":
        return <AddStudentPage />;
      default:
        return <Activity />;
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Dashboard - Attendance." />
      </Head>

      <div className="flex h-screen w-full">
        <div
          className={`${
            clicked ? "w-0" : "w-[200px]"
          } h-full transition-all duration-300 bg-base-100 shadow-lg fixed top-0 left-0 overflow-hidden border-r-2 border-opacity-10 border-slate-500`}
        >
          <Sidebar setRenderComp={setRenderComp} renderComp={renderComp} />{" "}
          {/* Pass function to Sidebar */}
        </div>

        <div
          className={`${clicked ? "ml-0 w-full" : "ml-[200px] flex-1 py-3"}`}
        >
          <div className="shadow-md">
            <Navbar handleToggle={handleToggle} setRenderComp={setRenderComp} />{" "}
            {/* Pass function to Navbar */}
          </div>
          {renderComponent()} {/* Render component based on state */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
