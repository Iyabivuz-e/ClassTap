"use client";
import { useEffect, useState } from "react";
import Home from "./components/home/Home";
import Theme from "./helpers/Themes";
import Head from "next/head";
import Loader from "./helpers/Loader";

export default function HomePage() {

  const [loading, setLoading] = useState(true); 

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    });

    return () => clearTimeout(timer); 
  }, []);

  const pageTitle = "Home - Attendance.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Home - Attendance." />
      </Head>

      {loading ? ( 
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
