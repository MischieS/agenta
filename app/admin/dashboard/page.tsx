'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Student } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { StaffAssignmentModal } from '@/components/staff-assignment-modal';
import { StudentMessagingModal } from '@/components/student-messaging-modal';

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningStudent, setAssigningStudent] = useState<string | null>(null);
  const [messagingStudent, setMessagingStudent] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchStudents();
    }
  }, [user?.token]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStaff = async (studentId: string, staffId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ staffId })
      });

      if (response.ok) {
        fetchStudents(); // Refresh the list
      }
    } catch (error) {
      console.error('Error assigning staff:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Submissions</h1>
      <DataTable 
        columns={columns} 
        data={students} 
        loading={loading}
        onAssignClick={(studentId) => setAssigningStudent(studentId)}
        onMessageClick={(studentId) => setMessagingStudent(studentId)}
      />
      
      <StaffAssignmentModal
        studentId={assigningStudent || ''}
        open={!!assigningStudent}
        onClose={() => setAssigningStudent(null)}
        onAssign={handleAssignStaff}
      />
      
      <StudentMessagingModal
        studentId={messagingStudent || ''}
        open={!!messagingStudent}
        onClose={() => setMessagingStudent(null)}
      />
    </div>
  );
}
