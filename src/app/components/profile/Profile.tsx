"use client";

import Image from "next/image";
import { FaEdit, FaKey } from "react-icons/fa";
import default_profile from "../../../../public/images/profile_default.png";
import { useStudentContext } from "@/app/context/StudentContext";
import Loader from "@/app/helpers/Loader";
import ProfileInformation from "./ProfileInformation";

const Profile = () => {
  const { director, loading } = useStudentContext();

  if (loading === null) return <Loader />;

  return (
    <>
      <div className="flex flex-col justify-center gap-4 items-center mt-6 w-full px-3">
        {/* intro */}
        <div className="flex flex-col gap-2 pb-2">
          <h1 className="text-3xl font-semibold text-center">
            Hi, {director?.fullname}, Welcome to your profile
          </h1>
          <span className="text-sm opacity-70 text-center">
            Manage your profile in your like
          </span>
        </div>
        {/* Edit */}
        <div className="flex items-center justify-between w-full gap-1 max-sm:gap-0 px-10">
          <button className="btn flex items-center gap-2">
            <FaEdit />
            Complete Your Profile
          </button>
          <button className="btn flex items-center gap-2">
            <FaKey />
            Change Password
          </button>
        </div>
        {/* profile photo and name */}
        <div className="border-2 border-base-300 border-opacity-30 shadow-md w-full flex justify-between p-4">
          <div className="flex items-center gap-5 ">
            <Image
              src={ director?.profilePicture ? director.profilePicture :
                default_profile
              }
              alt="profile-photo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl">{director?.fullname}</p>
              <p className=" text-sm opacity-70">
                Position: Director of Studies
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {director?.permissions.map((permission, index) => (
              <ul key={index}>
                <li className="font-semibold"> &#9989; {permission}</li>
              </ul>
            ))}
          </div>
        </div>
        <ProfileInformation/>
      </div>
    </>
  );
};

export default Profile;
