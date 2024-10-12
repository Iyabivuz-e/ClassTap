"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    setTimeout(() => {
      router.push("/director-of-study/dashboard"); 
      setLoading(false); 
    }, 2000); 
  };

  return (
    <div className="w-full hero justify-center">
      <div className="w-full hero-content flex-row-reverse max-sm:flex-col">
        <div className="text-center lg:text-left">
          <p className="py-6 text-lg">
            Please log in to view your dashboard. No account?
            <Link
              href="#"
              className="label-text-alt link link-hover ml-2 text-blue-400"
            >
              Register here
            </Link>
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
            </div>
            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
              <label className="label">
                <Link href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
            </div>
            {/* Submit Button with Spinner */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary flex items-center justify-center"
                disabled={loading} // Disable button when loading
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
                  "Login to Dashboard"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
