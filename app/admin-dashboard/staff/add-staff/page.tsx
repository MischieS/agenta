'use client';
import React from 'react';
import UserCreationForm from '../../components/UserCreationForm';
import { useRouter } from 'next/navigation';

export default function AddStaffPage() {
  const router = useRouter();

  const handleStaffCreated = () => {
    // Navigate back to staff page after successful creation
    setTimeout(() => {
      router.push('/admin-dashboard/staff');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading mb-2">Add New Staff Member</h1>
        <p className="admin-muted mb-6">
          Create a new staff account with a randomly generated password.
        </p>
      </div>
      
      <UserCreationForm userType="staff" onUserCreated={handleStaffCreated} />
    </div>
  );
}
