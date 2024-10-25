"use client";

import { useStudentContext } from "@/app/context/StudentContext";
import Loader from "@/app/helpers/Loader";
import React, { useState } from "react";

const ProfileInformation = () => {
  const { director, loading } = useStudentContext();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading === null) return <Loader />;
  return (
    <>
      {/* profile information */}
      <div className="flex w-full justify-between gap-4 max-sm:flex-col">
        {/* personal information */}
        <div className="flex flex-col gap-2 border-2 border-base-200 border-opacity-30 shadow-md w-full p-4">
          <h1 className="font-semibold text-2xl">Personal Information</h1>
          <div
            key={director?.fullname}
            className="text-sm flex flex-col gap-1 opacity-70"
          >
            <p className="">
              <span className="font-semibold">Full Name: </span>
              {director?.fullname}
            </p>
            <p className="">
              <span className="font-semibold">Phone Number: </span>
              {director?.phoneNumber}
            </p>
            <p className="">
              <span className="font-semibold">Role: </span>
              {director?.role}
            </p>
            <p className="">
              <span className="font-semibold">Email: </span>
              {director?.email}
            </p>
            <p className="">
              <span className="font-semibold">Password: </span>
              {showPassword ? director?.password : "********"}
              <button
                className="ml-2 text-blue-500 underline"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </p>
            <p className="">
              <span className="font-semibold">School Name: </span>
              {director?.schoolName}
            </p>
          </div>
        </div>
        {/* personal information */}

        <div className="flex flex-col gap-2 border-2 border-base-200 border-opacity-30 shadow-md w-full p-4">
          <h1 className="font-semibold text-2xl">Address</h1>
          <div
            key={director?.address.city}
            className="text-sm flex flex-col gap-1 opacity-70"
          >
            <p className="">
              <span className="font-semibold">Street: </span>
              {director?.address?.street}
            </p>
            <p className="">
              <span className="font-semibold">City: </span>
              {director?.address?.city}
            </p>
            <p className="">
              <span className="font-semibold">State/District: </span>
              {director?.address?.state}
            </p>
            <p className="">
              <span className="font-semibold">Postal Code: </span>
              {director?.address.postalCode}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInformation;
