"use client"

import React from 'react'

const Statistics = () => {
  return (
    <div className="flex justify-center items-center gap-3 mt-12 px-5 max-sm:flex-col">
      <div className="bg-base-100 w-full border-1 border-opacity-5 shadow-md">
        <h1 className="p-3 bg-base-200 text-center text-xl font-semibold">
          Total Present
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">350</h1>
        </div>
      </div>
      {/* Late */}
      <div className="bg-base-100 w-full border-1 border-opacity-15 shadow-md">
        <h1 className="p-3 bg-base-200 text-center text-xl font-semibold">
          Total Late
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">50</h1>
        </div>
      </div>
      {/* Absent */}
      <div className="bg-base-100 w-full border-1 border-opacity-15 shadow-md">
        <h1 className="p-3 bg-base-200 text-center text-xl font-semibold">
          Total Absent
        </h1>
        <div className="p-4 text-center">
          <h1 className="text-2xl">100</h1>
        </div>
      </div>
    </div>
  );
}

export default Statistics
