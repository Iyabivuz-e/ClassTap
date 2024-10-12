"use client"
import React from 'react'

const Loader = () => {
  return (
    <div className='flex absolute top-2/4 left-2/4'>
      <span className="loading loading-spinner text-success"></span>
    </div>
  );
}

export default Loader
