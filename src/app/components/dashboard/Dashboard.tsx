"use client";

import React, { useState } from "react";
import Navbar from "./bars/Navbar";
import Sidebar from "./bars/Sidebar";
import Activity from "../activities/Activity";

const Dashboard = () => {
  // Retrieve toggle state from localStorage or set it to false by default
  const [clicked, setClicked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebar-toggled");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  //handle toggle navigation
  const handleToggle = () => {
    const newState = !clicked;
    setClicked(newState);
    localStorage.setItem("sidebar-toggled", JSON.stringify(newState)); // Save new state to localStorage
  };

  return (
    <div className="flex h-screen w-full ">
      <div
        className={`${
          clicked ? "w-0" : "w-[200px]"
        } h-full transition-all duration-300 bg-base-100 shadow-lg fixed top-0 left-0 overflow-hidden border-r-2 border-opacity-10 border-slate-500`}
      >
        <Sidebar />
      </div>

      <div className={`${clicked ? "ml-0 w-full" : "ml-[200px] flex-1 py-3 "}`}>
        <div className="shadow-md">
          <Navbar handleToggle={handleToggle} />
        </div>
        <Activity />
      </div>
    </div>
  );
};

export default Dashboard;
