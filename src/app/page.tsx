"use client";
import { useEffect, useState } from "react";
import Home from "./components/home/Home";
import Theme from "./helpers/Themes";
import Loader from "./helpers/Loader";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    });

    return () => clearTimeout(timer);
  }, []);

  //Changing the head text
  const pathname = usePathname();
  useEffect(() => {
    // Extract the part of the pathname you want to include in the title
    if (pathname.includes("/")) {
      document.title = "Home - ClassTap";
    } else {
      document.title = "ClassTap"; // Default title
    }
  }, [pathname]); // This effect will run whenever the pathname changes

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-base-100 min-h-screen flex flex-col items-center justify-center">
          <div className="absolute top-3 right-12">
            <Theme />
          </div>
          <Home />
          {/* <aside className="opacity-50 my-2 text-sm px-2 text-center bg-red-500">
            <p>
              Copyright © {new Date().getFullYear()} - All rights reserved by
              CLASSTAP Industries Ltd
            </p>
          </aside> */}
          <footer className="footer py-6 mt-4 -mb-16 grid grid-rows-[auto-1fr-auto] text-neutral-content justify-center items-center max-md:flex max-sm:flex-col max-sm:gap-4 max-md:px-5 w-full">
            <aside className="grid-flow-col items-center">
              <p>
                Copyright © {new Date().getFullYear()} - All rights reserved by
                CLASSTAP Industries Ltd
              </p>
            </aside>
          </footer>
        </div>
      )}
    </>
  );
}
