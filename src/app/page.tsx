"use client";
import Home from "./components/home/Home";
import Theme from "./helpers/Themes";

export default function HomePage() {
  return (
    <div className="bg-base-100 min-h-screen flex flex-col items-center justify-center">
      <div className="absolute top-3 right-12">
        <Theme />
      </div>
      <Home />
      <aside className="opacity-50 my-2 text-sm px-2 text-center">
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by
          CLASSTAP Industries Ltd
        </p>
      </aside>
    </div>
  );
}
