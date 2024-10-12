"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    router.push("/director-of-study/dashboard"); 
  };

  return (
    <div className="w-full hero justify-center ">
      <div className="w-full hero-content flex-col">
        <div className="text-center lg:text-left">
          <p className="py-2 opacity-40">
            Please log in to view your dashboard
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            {" "}
            {/* Correctly pass the function */}
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
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
