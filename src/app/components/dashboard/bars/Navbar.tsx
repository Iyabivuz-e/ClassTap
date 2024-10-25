"use client";

import React, { useState } from "react";
import Image from "next/image";
import profile from "../../../../../public/images/profile_default.png";
import Theme from "@/app/helpers/Themes";
import Notifications from "./Notifications";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useStudentContext } from "@/app/context/StudentContext";

interface NavBarProp {
  handleToggle: () => void;
  setRenderComp: (comp: string) => void; // New prop to set rendered component
}

const Navbar = ({ handleToggle, setRenderComp }: NavBarProp) => {
  const router = useRouter();
  const [notifs, setNotifs] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("notification-toggled");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  //handle toggle notifications
  const handleToggleNotification = () => {
    const newState = !notifs;
    setNotifs(newState);
    localStorage.setItem("notification-toggled", JSON.stringify(newState));
  };

  const { director } = useStudentContext();

  const handleLogOut = async () => {
    try {
      const response = await axios.get("/api/directors/auth/logout");
      if (response.data.success) {
        console.log(response.data.message);
      }
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 sticky top-0">
      <div className="navbar-start">
        <div className="dropdown" onClick={handleToggle}>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl max-sm:hidden">
          Director of Studies Dashboard
        </a>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-ghost btn-circle"
          onClick={handleToggleNotification}
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                width={30}
                height={30}
                alt="Tailwind CSS Navbar component"
                src={
                  director?.profilePicture ? director.profilePicture : profile
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={() => setRenderComp("profile")}>
                {" "}
                {/* Trigger Profile render */}
                Profile
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button onClick={handleLogOut}>Logout</button>
            </li>
          </ul>
        </div>
        <Theme />
      </div>

      <Notifications notifs={notifs} />
    </div>
  );
};

export default Navbar;
