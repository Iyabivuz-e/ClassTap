"use client";
import { useEffect, useState } from "react";
import Home from "./components/home/Home";
import Theme from "./helpers/Themes";
import Head from "next/head";
import Loader from "./helpers/Loader";

export default function HomePage() {

  const [loading, setLoading] = useState(true); // Set loading to true initially

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide preloader after 2 seconds
    }); // Adjust the time as necessary

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  const pageTitle = "Home - Attendance.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Home - Attendance." />
      </Head>

      {loading ? ( // Conditional rendering based on loading state
        <Loader />
      ) : (
        <div className="bg-base-100 min-h-screen flex flex-col items-center justify-center">
          <div className="absolute top-3 right-12">
            <Theme />
          </div>
          <Home />
          <aside className="opacity-50 my-2 text-sm px-2 text-center">
            <p>
              Copyright © {new Date().getFullYear()} - All rights reserved by
              CLASSTAP Industries Ltd
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
