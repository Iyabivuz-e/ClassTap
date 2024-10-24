"use client"
import React, { useState } from 'react'
import Login from './authentication/Login'
import Register from './authentication/Register'

const Home = () => {

  const [ toggleLogin, setToggleLogin] = useState(true)

    const handleToggleForm = () => {
      setToggleLogin(!toggleLogin);
    }
  return (
    <div className="w-full -mb-2">
      <div className="hero-content text-center w-full">
        <div className="w-full ">
          <h1 className="text-4xl font-bold">Welcome, Director of Studies!</h1>
          <p className="py-3 pb-0">
            View and manage students&apos; attendance effortlessly.
          </p>
        </div>
      </div>

      {toggleLogin ? (
        <Login toggleForm={handleToggleForm} />
      ) : (
        <Register toggleForm={handleToggleForm} />
      )}
    </div>
  );
}

export default Home
