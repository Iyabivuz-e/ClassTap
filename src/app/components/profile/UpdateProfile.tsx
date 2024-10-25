"use client";

import React, { useState, useEffect } from "react";
import { useStudentContext } from "@/app/context/StudentContext";
import Loader from "@/app/helpers/Loader"; // Assuming you have a loader component

const UpdateProfile: React.FC = () => {
  const { director, loading } = useStudentContext(); // Fetch the director's data from context
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    schoolName: "",
    role: "",
    status: "",
    phoneNumber: "",
    permissions: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    profilePicture: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To manage form submission state

  // Update the form data once the director is available
  useEffect(() => {
  if (director) {
    setFormData({
      fullname: director.fullname || "",
      email: director.email || "",
      phoneNumber: director.phoneNumber?.toString() || "", // Convert to string
      role: director.role || "",
      schoolName: director.schoolName || "",
      status: director.status || "", // Include status
      permissions: director.permissions || "", // Include permissions
      address: {
        street: director.address?.street || "",
        city: director.address?.city || "",
        state: director.address?.state || "",
        postalCode: director.address?.postalCode || "",
      },
      profilePicture: director.profilePicture || null,
    });
  }
}, [director]);


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Ensure it defaults to null
    setFormData({ ...formData, profilePicture: file });
  };


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedFormData = {
        ...formData,
        permissions: formData.permissions.split(",").map((perm) => perm.trim()), // Convert to array
      };

      const response = await fetch(`/api/directors/auth/${director?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      if (response.ok) {
        return (
          <div role="alert" className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Profile updated Successfully!</span>
          </div>
        );
      } else {
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{data.error || "Failed to update profile."}</span>
        </div>;
      }
    } catch (error) {
      <div role="alert" className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>An error occurred while updating the profile.</span>
      </div>;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto px-8 max-sm:px-2 py-5 -mt-3 rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Update Your Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 w-full">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter full name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Phone Number</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter role"
              className="input input-bordered w-full"
              required
            />
          </div>
          {/* Permissions */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Permissions (comma-separated)
              </span>
            </label>
            <input
              type="text"
              name="permissions"
              value={formData.permissions} // Binding the permissions string
              onChange={handleChange} // Handle change to update permissions string
              placeholder="Enter permissions separated by commas"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.status}
              onChange={handleChange}
              placeholder="Enter role"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* School Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">School Name</span>
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Street</span>
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Enter street"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">City</span>
            </label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">State</span>
            </label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Postal Code</span>
            </label>
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="block font-medium">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="form-control mt-6">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;

//"bg-gray-100 min-h-screen flex items-center justify-center
//
