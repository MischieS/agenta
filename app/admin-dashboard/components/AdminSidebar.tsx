'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  UserIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin-dashboard', icon: <ChartBarIcon className="w-5 h-5" />, exact: true },
    { name: 'Students', href: '/admin-dashboard/students', icon: <AcademicCapIcon className="w-5 h-5" /> },
    { name: 'Staff', href: '/admin-dashboard/staff', icon: <UserGroupIcon className="w-5 h-5" /> },
    { name: 'Universities', href: '/admin-dashboard/universities', icon: <AcademicCapIcon className="w-5 h-5" /> },
    { name: 'Analytics', href: '/admin-dashboard/analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
    { name: 'User Documents', href: '/admin-dashboard/user-documents', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { name: 'Audit Logs', href: '/admin-dashboard/audit-logs', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { name: 'Notifications', href: '/admin-dashboard/notifications', icon: <BellAlertIcon className="w-5 h-5" /> },
    { name: 'Profile', href: '/admin-dashboard/profile', icon: <UserIcon className="w-5 h-5" /> },
    { name: 'Roles', href: '/admin-dashboard/roles', icon: <UserGroupIcon className="w-5 h-5" /> },
    { name: 'Bulk Operations', href: '/admin-dashboard/bulk-operations', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { name: 'Student-Staff Assignment', href: '/admin-dashboard/student-staff-assignment', icon: <UserIcon className="w-5 h-5" /> },
    { name: 'Support Chat', href: '/admin-dashboard/support-chat', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
    { name: 'Messaging', href: '/admin-dashboard/messaging', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> }
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className={`bg-gray-800 text-white h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col sticky top-0 shadow-lg`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-bold text-white">Admin</h2>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-full hover:bg-gray-700 transition"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index} className="px-2">
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.href, item.exact) 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link 
          href="/admin-dashboard/settings" 
          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/admin-dashboard/settings') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Cog6ToothIcon className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
