'use client';
import React from 'react';
import UserCreationForm from '../../components/UserCreationForm';
import { useRouter } from 'next/navigation';

export default function AddStudentPage() {
  const router = useRouter();

  const handleStudentCreated = () => {
    // Navigate back to students page after successful creation
    setTimeout(() => {
      router.push('/admin-dashboard/students');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading mb-2">Add New Student</h1>
        <p className="admin-muted mb-6">
          Create a new student account with a randomly generated password.
        </p>
      </div>
      
      <UserCreationForm userType="student" onUserCreated={handleStudentCreated} />
    </div>
  );
}
