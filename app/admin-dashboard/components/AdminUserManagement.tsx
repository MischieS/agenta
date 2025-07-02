'use client';
import React, { useState, useEffect } from 'react';
import { AdminRoleType, canAccessFeature, getPermissionsByRole } from '../permissions';

// User interface matching the backend User entity
interface User {
  id: string;
  name?: string;
  surname?: string;
  role?: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const roleOptions: { value: AdminRoleType; label: string }[] = [
  { value: 'admin', label: 'Admin (Super User)' },
  { value: 'chief', label: 'Chief' },
  { value: 'manager', label: 'Manager' },
  { value: 'sales', label: 'Sales' },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<AdminRoleType>('admin'); // For demonstration purposes
  
  // Fetch users function - to be implemented
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  // Update user role function
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) throw new Error('Failed to update user role');
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    }
  };

  // Generate random password for new users
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Create new admin user
  const createAdminUser = async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      
      const newUser = await response.json();
      setUsers([...users, newUser]);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Only render if user has appropriate permissions
  if (!canAccessFeature(currentRole, 'user_management')) {
    return (
      <div className="admin-card p-5 admin-status-warning rounded-lg">
        <p className="font-medium">You don't have permission to manage users.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div></div>;
  }

  if (error) {
    return <div className="admin-card admin-status-error p-5 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold admin-heading">Admin User Management</h2>
        <button 
          className="admin-btn-primary"
          onClick={() => {
            const password = generateRandomPassword();
            const newUserData = {
              email: `admin${Math.floor(Math.random() * 10000)}@example.com`,
              name: "New",
              surname: "Admin",
              role: "sales", // Default lowest role
              password,
            };
            
            createAdminUser(newUserData)
              .then(() => alert(`User created with password: ${password}`))
              .catch(console.error);
          }}
        >
          Add New Admin User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="admin-text">{user.name} {user.surname}</td>
                <td className="admin-text">{user.email}</td>
                <td>
                  <select 
                    value={user.role || 'sales'} 
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    disabled={!getPermissionsByRole(currentRole).find(p => p.feature === 'user_management')?.can_edit}
                    className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="space-x-2">
                  <button 
                    className="admin-btn-primary text-sm px-3 py-1"
                    disabled={!getPermissionsByRole(currentRole).find(p => p.feature === 'user_management')?.can_edit}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md transition-colors"
                    disabled={!getPermissionsByRole(currentRole).find(p => p.feature === 'user_management')?.can_delete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
