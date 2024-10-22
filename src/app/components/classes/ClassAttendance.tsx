"use client"

import React from "react";
import StudentList from "../student-management/StudentList";

const ClassAttendance = () => {
  return (
    <div className="mt-6 flex flex-col justify-center">
      <div>
        <details className="dropdown">
          <summary className="btn m-1">Level 3</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <a>Software</a>
            </li>
            <li>
              <a>Networking</a>
            </li>
            <li>
              <a>Business</a>
            </li>
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">Level 4</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <a>Software</a>
            </li>
            <li>
              <a>Networking</a>
            </li>
            <li>
              <a>Business</a>
            </li>
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">Level 5</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <a>Software</a>
            </li>
            <li>
              <a>Networking</a>
            </li>
            <li>
              <a>Business</a>
            </li>
          </ul>
        </details>
      </div>

      <StudentList />
    </div>
  );
};

export default ClassAttendance;
