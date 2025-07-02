import React from 'react';
import AdminMessaging from '../components/AdminMessaging';

export default function MessagingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading font-bold mb-2">Messaging</h1>
        <p className="admin-muted mb-6">
          Send messages to students and staff members from the admin dashboard.
        </p>
      </div>
      
      <AdminMessaging />
    </div>
  );
}
