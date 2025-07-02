import React from 'react';
import StaffManagement from '../../components/StaffManagement';

export default function StaffListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
        <p className="text-gray-600 mb-6">
          View and manage staff members. Edit staff details, departments, and positions.
          Staff members can be assigned to students in the Student-Staff Assignment section.
        </p>
      </div>
      
      <StaffManagement />
    </div>
  );
}
