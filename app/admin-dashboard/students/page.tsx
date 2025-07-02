"use client";

import React from "react";
import StudentTable from "../components/StudentTable";

export default function StudentsPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 px-4 sm:px-6">Student Management</h1>
      <div className="px-4 sm:px-6">
        <StudentTable />
      </div>
    </div>
  );
}
