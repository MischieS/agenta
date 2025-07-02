import React from 'react';
import StudentStaffAssignment from '../components/StudentStaffAssignment';

export default function StudentStaffAssignmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading font-bold mb-2">Student-Staff Assignment</h1>
        <p className="admin-muted mb-6">
          Assign students to staff members for advising, supervision, and management purposes.
          Staff members can be assigned multiple students based on their capacity and role.
        </p>
      </div>
      
      <StudentStaffAssignment />
    </div>
  );
}
