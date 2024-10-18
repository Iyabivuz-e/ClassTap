"use client";

import Image from "next/image";
import { useState } from "react";
import { FaUser, FaEdit, FaKey } from "react-icons/fa"; 
import profile from "../../../../public/images/imggggh.jpg";
import { useStudentContext } from "@/app/context/StudentContext";
import Loader from "@/app/helpers/Loader";

const Profile = () => {
  const { directors, loading } = useStudentContext();
  const [showPassword, setShowPassword] = useState(false); 

  const director = directors.length > 0 ? directors[0] : null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

    if (loading === null) return <Loader />;

  return (
    <>
      <div className="flex flex-col justify-center gap-4 items-center mt-6 w-full px-3">
        {/* intro */}
        <div className="flex flex-col gap-1 pb-2">
          <h1 className="text-3xl font-semibold text-center">
            Hi, {director?.fullname}, Welcome to your profile
          </h1>
          <span className="text-sm opacity-70 text-center">
            Manage your profile in your like
          </span>
        </div>
        {/* Edit */}
        <div className="flex items-center justify-between w-full px-10">
          <button className="btn flex items-center gap-2">
            <FaUser />
            Profile
          </button>
          <button className="btn flex items-center gap-2">
            <FaEdit />
            Edit Profile
          </button>
          <button className="btn flex items-center gap-2">
            <FaKey />
            Change Password
          </button>
        </div>
        {/* profile photo and name */}
        <div className="flex items-center gap-5 border-2 border-base-200 border-opacity-30 shadow-md w-full p-4">
          <Image
            src={profile}
            alt="profile-photo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-xl">{director?.fullname}</p>
            <p className=" text-sm">Position: Director of Studies</p>
          </div>
        </div>
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
      </div>
    </>
  );
};

export default Profile;
