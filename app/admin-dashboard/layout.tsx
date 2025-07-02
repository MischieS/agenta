import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import { AuthProvider } from "./contexts/AuthContext";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Enhanced Sidebar with collapsible feature */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header area */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="admin-btn-secondary">Settings</button>
              <button className="admin-btn-primary">Log Out</button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-full px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
