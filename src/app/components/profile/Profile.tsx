"use client";

import Image from "next/image";
import { FaEdit, FaKey } from "react-icons/fa";
import default_profile from "../../../../public/images/profile_default.png";
import { useStudentContext } from "@/app/context/StudentContext";
import Loader from "@/app/helpers/Loader";
import ProfileInformation from "./ProfileInformation";
import UpdateProfile from "./UpdateProfile";


const Profile = () => {
  const { director, loading } = useStudentContext();

  if (loading) return <Loader />;

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
        <div className="flex max-sm:flex-col max-sm:px-2 justify-between w-full gap-2 max-sm:gap-3 px-10">
          <button
            className="btn flex items-center gap-2"
            onClick={() => document.getElementById("my_modal_4").showModal()}
          >
            <FaEdit />
            Complete/Edit Your Profile
          </button>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <dialog id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <UpdateProfile />
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <button className="btn flex items-center gap-2">
            <FaKey />
            Change Password
          </button>
        </div>
        {/* profile photo and name */}
        <div className=" max-sm:flex-col gap-3 max-sm:gap-5 border-2 border-base-300 border-opacity-30 shadow-md w-full flex justify-between p-4">
          <div className="flex items-center gap-5 ">
            <Image
              src={
                director?.profilePicture
                  ? director.profilePicture
                  : default_profile
              }
              alt="profile-photo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-xl">{director?.fullname}</p>
              <p className=" text-sm opacity-70">Position: {director?.role}</p>
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
        <ProfileInformation />
      </div>
    </>
  );
};

export default Profile;
