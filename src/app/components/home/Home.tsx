import React from 'react'
import Login from './authentication/Login'

const Home = () => {
  return (
    <div className='w-full -mb-2'>
      <div className="hero-content text-center w-full">
        <div className="w-full ">
          <h1 className="text-4xl font-bold">Welcome, Director of Studies!</h1>
          <p className="py-3 pb-0">
            View and manage students&apos; attendance effortlessly.
          </p>
        </div>
      </div>
      <Login />
    </div>
  );
}

export default Home
