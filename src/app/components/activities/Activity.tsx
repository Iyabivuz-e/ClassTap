"use client";

import React from "react";
import Students from "./Students";
import Statistics from "./Statistics";
import Loader from "@/app/helpers/Loader";
import { useStudentContext } from "@/app/context/StudentContext";

const Activity = () => {
  const { loading } = useStudentContext();

  if (loading) return <Loader />;

  return (
    <div className="w-full">
      <div className="text-center mt-8 ">
        <h1 className="text-3xl font-semibold">
          Friday, Oct 11, 2024 Active attendances
        </h1>
      </div>

      {/* Total of present students, late, and absent */}
      <Statistics />

      {/* Provisionalll */}
      <Students />
    </div>
  );
};

export default Activity;
