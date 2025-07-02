import React from 'react';
import StaffPermissionsManager from '../../components/StaffPermissionsManager';

export default function StaffPermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Staff Permissions Management</h1>
        <p className="text-gray-600 mb-6">
          Manage roles and permissions for staff members in the system.
          Roles are organized in a hierarchy: admin > chief > manager > sales.
        </p>
      </div>
      
      <StaffPermissionsManager />
    </div>
  );
}
