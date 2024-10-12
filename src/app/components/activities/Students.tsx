import React from "react";
import AttendanceList from "./AttendanceList";

const Students = () => {
  return (
    <div className="flex flex-col px-5 mt-20 ">
      <div className="flex justify-between gap-2 items-center max-sm:flex-col max-sm:gap-3 max-sm:w-full ">
        {/* <div className="flex btn btn-outline gap-2 items-center cursor-default">
          <p>Present All</p>
          <input type="checkbox" name="mark-all" className="cursor-pointer" />
        </div> */}
        {/* Filtering through the present, absent and late */}
        <div className="join max-sm:justify-between max-sm:w-full max-sm:bg-base-200 ">
          <button className="join-item btn text-green-500 hover:bg-green-500  hover:text-base-100">
            Present
          </button>
          <button className="join-item btn text-yellow-500 hover:bg-yellow-500  hover:text-base-100">
            Late
          </button>
          <button className="join-item btn text-red-500 hover:bg-red-500  hover:text-base-100">
            Absent
          </button>
        </div>

        <label className="input input-bordered flex items-center gap-2 max-sm:w-full -z-50">
          <input type="text" className="grow" placeholder="Search Student" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <AttendanceList />
    </div>
  );
};

export default Students;
