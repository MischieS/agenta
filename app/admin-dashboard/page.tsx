'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  DocumentTextIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  pendingDocuments: number;
  universities: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalStaff: 0,
    pendingDocuments: 0,
    universities: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch actual data from Supabase tables with original table names
        const [studentsResult, staffResult, documentsResult, universitiesResult, activitiesResult] = await Promise.all([
          supabase.from('student').select('count'),
          supabase.from('user').select('count').in('role', ['staff', 'admin']),
          supabase.from('documents').select('count').eq('status', 'pending'),
          supabase.from('university').select('*'),
          supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(5)
        ]);
        
        // Handle potential errors in any of the queries
        let errorMessages = [];
        if (studentsResult.error) errorMessages.push(`Error fetching students: ${studentsResult.error.message}`);
        if (staffResult.error) errorMessages.push(`Error fetching staff: ${staffResult.error.message}`);
        if (documentsResult.error) errorMessages.push(`Error fetching documents: ${documentsResult.error.message}`);
        if (universitiesResult.error) errorMessages.push(`Error fetching universities: ${universitiesResult.error.message}`);
        if (activitiesResult.error) errorMessages.push(`Error fetching activities: ${activitiesResult.error.message}`);
        
        if (errorMessages.length > 0) {
          setError(errorMessages.join('; '));
          // Continue with partial data instead of throwing error and using mock data
        }

        // Update stats with real data
        setStats({
          totalStudents: studentsResult.count || 0,
          totalStaff: staffResult.count || 0,
          pendingDocuments: documentsResult.count || 0,
          universities: Array.isArray(universitiesResult.data) ? universitiesResult.data.length : 0
        });

        // Transform activities into our format
        if (activitiesResult.data) {
          const formattedActivities: RecentActivity[] = activitiesResult.data.map(activity => ({
            id: activity.id || '',
            type: activity.action_type || activity.payload?.action || 'system_action',
            description: activity.payload?.message || activity.ip_address || 'System activity',
            date: new Date(activity.created_at).toISOString(),
            status: getActivityStatus(activity.action_type || activity.payload?.action || 'system_action')
          }));
          
          setRecentActivity(formattedActivities);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
        
        // Only use mock data if we have no real data at all
        if (!stats.totalStudents && !stats.totalStaff && !stats.pendingDocuments && !stats.universities && recentActivity.length === 0) {
          useMockData();
        }
      }
    }

    fetchDashboardData();
  }, []);

  // Helper function to determine activity status
  function getActivityStatus(type: string): 'success' | 'warning' | 'error' | 'info' {
    if (type.includes('create') || type.includes('approve')) return 'success';
    if (type.includes('update') || type.includes('modify')) return 'info';
    if (type.includes('reject') || type.includes('suspend')) return 'warning';
    if (type.includes('delete') || type.includes('error')) return 'error';
    return 'info';
  }

  // Fallback to mock data if API calls fail
  function useMockData() {
    setStats({
      totalStudents: 245,
      totalStaff: 28,
      pendingDocuments: 17,
      universities: 12
    });

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'student_create',
        description: 'New student John Doe was added to the system',
        date: new Date('2025-06-29T10:30:00').toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'document_approve',
        description: 'Student passport verification approved',
        date: new Date('2025-06-29T09:15:00').toISOString(),
        status: 'success'
      },
      {
        id: '3',
        type: 'document_reject',
        description: 'Transcript document rejected - poor quality scan',
        date: new Date('2025-06-28T16:40:00').toISOString(),
        status: 'warning'
      },
      {
        id: '4',
        type: 'staff_update',
        description: 'Staff member Sarah Johnson role updated',
        date: new Date('2025-06-28T13:20:00').toISOString(),
        status: 'info'
      },
      {
        id: '5',
        type: 'error_login',
        description: 'Multiple failed login attempts detected',
        date: new Date('2025-06-27T11:05:00').toISOString(),
        status: 'error'
      }
    ];

    setRecentActivity(mockActivities);
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Dashboard Overview</h1>
        <p className="text-gray-600 mb-6">Overview of system status and recent activity</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Quick Stats Section */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <Link href="/admin-dashboard/students" className="block">
          <motion.div className="admin-card p-6 cursor-pointer" whileHover={{ scale: 1.04, backgroundColor: '#23293a' }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <AcademicCapIcon className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stats.totalStudents}</div>
            <span className="admin-muted">Total Students</span>
          </motion.div>
        </Link>
        <Link href="/admin-dashboard/staff" className="block">
          <motion.div className="admin-card p-6 cursor-pointer" whileHover={{ scale: 1.04, backgroundColor: '#23293a' }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <UserGroupIcon className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stats.totalStaff}</div>
            <span className="admin-muted">Total Staff</span>
          </motion.div>
        </Link>
        <Link href="/admin-dashboard/user-documents" className="block">
          <motion.div className="admin-card p-6 cursor-pointer" whileHover={{ scale: 1.04, backgroundColor: '#23293a' }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <DocumentTextIcon className="w-8 h-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stats.pendingDocuments}</div>
            <span className="admin-muted">Pending Documents</span>
          </motion.div>
        </Link>
        <Link href="/admin-dashboard/universities" className="block">
          <motion.div className="admin-card p-6 cursor-pointer" whileHover={{ scale: 1.04, backgroundColor: '#23293a' }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <ChartBarIcon className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{stats.universities}</div>
            <span className="admin-muted">Universities</span>
          </motion.div>
        </Link>
      </motion.div>
      
      {/* Quick Actions */}
      <div className="admin-card p-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="admin-heading text-lg font-semibold mb-2">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Link href="/admin-dashboard/students/add-student" className="border rounded-lg p-4 hover:bg-gray-800/40 dark:hover:bg-gray-700/60 flex flex-col items-center justify-center text-center">
            <AcademicCapIcon className="h-10 w-10 text-blue-500 mb-2" />
            <span className="font-medium admin-heading">Add New Student</span>
          </Link>
          
          <Link href="/admin-dashboard/staff/add-staff" className="border rounded-lg p-4 hover:bg-gray-800/40 dark:hover:bg-gray-700/60 flex flex-col items-center justify-center text-center">
            <UserGroupIcon className="h-10 w-10 text-green-500 mb-2" />
            <span className="font-medium admin-heading">Add New Staff</span>
          </Link>
          
          <Link href="/admin-dashboard/analytics" className="border rounded-lg p-4 hover:bg-gray-800/40 dark:hover:bg-gray-700/60 flex flex-col items-center justify-center text-center">
            <ChartBarIcon className="h-10 w-10 text-purple-500 mb-2" />
            <span className="font-medium admin-heading">View Analytics</span>
          </Link>
          
          <Link href="/admin-dashboard/user-documents" className="border rounded-lg p-4 hover:bg-gray-800/40 dark:hover:bg-gray-700/60 flex flex-col items-center justify-center text-center">
            <DocumentTextIcon className="h-10 w-10 text-yellow-500 mb-2" />
            <span className="font-medium admin-heading">Review Documents</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="admin-card p-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.length === 0 ? (
            <p className="p-6 text-center text-gray-800 dark:text-gray-300">No recent activity found</p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start space-x-4">
                <div className={
                  activity.status === 'success' ? 'bg-green-100 dark:bg-green-900 p-2 rounded-full' :
                  activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full' :
                  activity.status === 'error' ? 'bg-red-100 dark:bg-red-900 p-2 rounded-full' :
                  'bg-blue-100 dark:bg-blue-900 p-2 rounded-full'
                }>
                  {activity.status === 'success' && <CheckCircleIcon className="h-6 w-6 text-green-700 dark:text-green-400" />}
                  {activity.status === 'warning' && <ExclamationCircleIcon className="h-6 w-6 text-yellow-700 dark:text-yellow-400" />}
                  {activity.status === 'error' && <ExclamationCircleIcon className="h-6 w-6 text-red-700 dark:text-red-400" />}
                  {activity.status === 'info' && <BellAlertIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="admin-text text-sm">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Link href="/admin-dashboard/activity-log" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            View all activity →
          </Link>
        </div>
      </div>
    </div>
  );
}
