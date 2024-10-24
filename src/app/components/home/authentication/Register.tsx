"use client";

import React, { useState } from "react";
import axios from "axios";

interface Props {
  toggleForm: () => void;
}

const Register = ({ toggleForm }: Props) => {

  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // Collect the form data (e.g., email and password)
    const formData = new FormData(e.currentTarget);
    const fullname = formData.get("fullname");
    const schoolName = formData.get("schoolName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // API request to registeration route
      const response = await axios.post("/api/directors/auth/register", {
        fullname,
        schoolName,
        email,
        password,
      });

      if (response.status === 201) {
        toggleForm()
      }
    } catch (err: any) {
      // Handle error, display an appropriate error message
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full hero justify-center">
      <div className="w-full hero-content flex-row-reverse max-sm:flex-col">
        <div className="text-center lg:text-left">
          <p className="py-6 text-lg">
            Please register to log in to your dashboard. Already have an
            account?
            <button
              onClick={toggleForm}
              className="label-text-alt link link-hover ml-2 text-blue-400"
            >
              Login here
            </button>
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleRegister} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="fullname"
                className="input input-bordered "
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">School Name</span>
              </label>
              <input
                type="text"
                name="schoolName"
                placeholder="e.x: World mission high school "
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
              {/* <label className="label">
                <Link href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label> */}
            </div>

            {error && (
              <div className="btn btn-error my-2 ">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
