'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminRoleType, AdminPermission, getPermissionsByRole, canAccessFeature, isRoleHigherThan } from '../permissions';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
}

export default function StaffPermissionsManager() {
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission('staff', 'can_edit');
  const isAdmin = user?.role === 'admin';
  
  // State variables
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for role editing
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Fetch staff members
  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would be an API call
      // Mock data for now
      const mockStaff: Staff[] = [
        { id: '201', name: 'Robert Smith', email: 'robert@example.com', role: 'manager', department: 'Student Affairs', position: 'Manager' },
        { id: '202', name: 'Elizabeth Moore', email: 'elizabeth@example.com', role: 'sales', department: 'Admissions', position: 'Coordinator' },
        { id: '203', name: 'Michael Brown', email: 'michael@example.com', role: 'chief', department: 'Academic Affairs', position: 'Director' },
        { id: '204', name: 'Patricia Anderson', email: 'patricia@example.com', role: 'manager', department: 'Career Services', position: 'Manager' },
        { id: '205', name: 'Richard Wilson', email: 'richard@example.com', role: 'sales', department: 'International Relations', position: 'Officer' },
      ];
      
      setStaff(mockStaff);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch staff:', err);
      setError('Failed to load staff members');
      setLoading(false);
    }
  };
  
  // Update staff role
  const updateStaffRole = async () => {
    if (!selectedStaff || !selectedRole) {
      setError('Please select a staff member and role');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // In a real implementation, this would be an API call
      // For now, just update the local state
      
      // Check if user can promote to this role
      if (user && !isRoleHigherThan(user.role, selectedRole as AdminRoleType)) {
        setError(`You don't have permission to assign the ${selectedRole} role`);
        setSaving(false);
        return;
      }
      
      // Update staff role
      const updatedStaff = staff.map(s => 
        s.id === selectedStaff.id ? { ...s, role: selectedRole } : s
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStaff(updatedStaff);
      setSelectedStaff({...selectedStaff, role: selectedRole});
      
      // Show success message
      setSuccess(`Role updated successfully for ${selectedStaff.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setSaving(false);
    } catch (err: any) {
      console.error('Failed to update role:', err);
      setError(err.message || 'Failed to update role');
      setSaving(false);
    }
  };

  // Load staff on initial render
  useEffect(() => {
    fetchStaff();
  }, []);

  // Reset selected role when selected staff changes
  useEffect(() => {
    if (selectedStaff) {
      setSelectedRole(selectedStaff.role);
    } else {
      setSelectedRole('');
    }
  }, [selectedStaff]);

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (!user) return [];
    
    // Admin can assign any role except admin
    const roles: AdminRoleType[] = ['chief', 'manager', 'sales'];
    if (user.role === 'admin') {
      return roles;
    }
    // Others can only assign roles below them in hierarchy
    const userRole = user.role as AdminRoleType;
    return roles.filter(role => isRoleHigherThan(userRole, role));
  };

  // Get permissions for a specific role
  const getRolePermissions = (role: string) => {
    const permissions = getPermissionsByRole(role as AdminRoleType);
    const permissionsMap: Record<string, string[]> = {};
    permissions.forEach((perm: AdminPermission) => {
      permissionsMap[perm.feature] = [];
      if (perm.can_view) permissionsMap[perm.feature].push('can_view');
      if (perm.can_edit) permissionsMap[perm.feature].push('can_edit');
      if (perm.can_delete) permissionsMap[perm.feature].push('can_delete');
    });
    return permissionsMap;
  };


  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  if (!canEdit && !isAdmin) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-700">
        You don't have permission to manage staff permissions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700">
          {error}
          <button 
            className="ml-2 text-red-900 hover:underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded text-green-700">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Staff Members</h3>
          
          {staff.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No staff members found</div>
          ) : (
            <div className="space-y-2">
              {staff.map(staffMember => (
                <div 
                  key={staffMember.id}
                  onClick={() => setSelectedStaff(staffMember)}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedStaff?.id === staffMember.id ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                >
                  <div className="font-medium">{staffMember.name}</div>
                  <div className="text-sm text-gray-500">{staffMember.email}</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                      {staffMember.department}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      staffMember.role === 'chief' ? 'bg-purple-100 text-purple-700' : 
                      staffMember.role === 'manager' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {staffMember.role.charAt(0).toUpperCase() + staffMember.role.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Role Assignment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Role Assignment</h3>
          
          {!selectedStaff ? (
            <div className="text-center text-gray-500 py-4">Select a staff member to manage roles</div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="font-medium">{selectedStaff.name}</div>
                <div className="text-sm text-gray-500">{selectedStaff.email}</div>
                <div className="text-sm mt-1">
                  Current Role: <span className="font-medium">{selectedStaff.role.charAt(0).toUpperCase() + selectedStaff.role.slice(1)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  {getAvailableRoles().map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                
                <div className="mt-2 text-xs text-gray-500">
                  * You can only assign roles of equal or lower privilege than your own.
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={updateStaffRole}
                  disabled={saving || selectedRole === selectedStaff.role}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Permissions Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Role Permissions</h3>
          
          {!selectedStaff ? (
            <div className="text-center text-gray-500 py-4">Select a staff member to view permissions</div>
          ) : (
            <>
              <div className="mb-4 p-2 bg-gray-50 border rounded text-sm">
                <strong>Role: </strong>
                <span className="font-medium">
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </span>
              </div>
              
              <div className="overflow-y-auto max-h-80 space-y-3">
                {Object.entries(getRolePermissions(selectedRole)).map(([feature, permissions]) => (
                  <div key={feature} className="p-3 border rounded">
                    <div className="font-medium mb-1">
                      {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {permissions.length > 0 ? (
                        permissions.map(perm => (
                          <span 
                            key={perm} 
                            className={`text-xs px-2 py-1 rounded ${
                              perm === 'can_view' ? 'bg-green-100 text-green-700' :
                              perm === 'can_edit' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            {perm.replace('can_', '').charAt(0).toUpperCase() + perm.replace('can_', '').slice(1)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">No permissions</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
