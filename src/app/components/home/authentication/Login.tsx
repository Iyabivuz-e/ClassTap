"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // For making API calls

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // Collect the form data (e.g., email and password)
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Make API request to login route (assuming a POST request to /api/login)
      const response = await axios.post("/api/directors/auth/login", {
        email,
        password,
      });

      // Check if the login is successful and redirect to the dashboard
      if (response.status === 201) {
        router.push("/director-of-study/dashboard");
      }
    } catch (err: any) {
      // Handle error, display an appropriate error message
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  return (
    <div className="w-full hero justify-center">
      <div className="w-full hero-content flex-row-reverse max-sm:flex-col">
        <div className="text-center lg:text-left">
          <p className="py-6 text-lg">
            Please log in to view your dashboard. No account?
            <Link
              href="/register"
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
                name="email"
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
                name="password"
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

            {/* Error Message */}
            {error && (
              <div className="alert alert-error my-2">
                <span>{error}</span>
              </div>
            )}

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

//api/directors/auth/login
