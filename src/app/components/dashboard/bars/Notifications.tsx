"use client";

import React from "react";

interface NavBarProp {
  notification: boolean;
}

const Notifications = ({ notification }: NavBarProp) => {
  return (
    <div
      className={`${
        notification ? "opacity-100 " : "opacity-0"
      } rounded-md flex transition-all flex-col duration-400 bg-base-200 shadow-md h-[550px] w-[400px] max-sm:w-full absolute top-[70px] max-sm:right-0 right-3 px-2
      `}
    >
      <div className="flex justify-between gap-2 items-center w-full py-4">
        <h1 className="text-3xl max-sm:text-xl font-bold">Notifications</h1>
        <button className="btn btn-neutral px-2 py-1">Mark all read</button>
      </div>

      {/* Notification board */}
      <div className="w-full flex flex-col gap-3 shadow-md">
        <div className="bg-base-100 px-3 py-2 rounded-md font-bold ">
          <div className="flex items-center justify-between gap-2">
            <p> Dieudonne Iyabivuze is present in the school </p>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
          <p className="text-blue-500 text-sm font-normal"> 1m ago </p>
        </div>
        <div className="bg-base-100 px-3 py-2 rounded-md">
          <p> Niyibikora Obed is present in the school </p>
          <p> 1h ago </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
