"use client"

import React from 'react'
import ClassAttendance from './ClassAttendance'

const Classes = () => {
  return (
    <div className="flex flex-col p-5">
      <h1 className="text-center text-2xl font-semibold">
        Manage classes attendance effectively...
      </h1>
      <div className="mt-4 text-sm opacity-70 flex flex-col justify-center items-center">
        <p>1. Choose a class level (e.g: Level 3)</p>
        <p>2. Choose a course assosiated to a class level (e.g: Software)</p>
        <p>3. And Boom *** </p>
      </div>
      <ClassAttendance />
    </div>
  );
}

export default Classes
