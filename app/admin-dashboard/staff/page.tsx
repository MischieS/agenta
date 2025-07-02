import React from 'react';
import AdminUserManagement from '../components/AdminUserManagement';
import StaffTable from "../components/StaffTable";

export default function StaffPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 px-4 sm:px-6">Staff Management</h1>
      <div className="px-4 sm:px-6">
        <StaffTable />
      </div>
    </div>
  );
}
