import React from 'react';
import dynamic from 'next/dynamic';

// Import the ModernSupportChat component with SSR disabled
const ModernSupportChat = dynamic(
  () => import('../components/ModernSupportChat'),
  { ssr: false }
);

export default function SupportChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading font-bold mb-2">Support Chat</h1>
        <p className="admin-muted mb-6">
          View and respond to support messages from students and staff members.
        </p>
      </div>
      
      <ModernSupportChat />
    </div>
  );
}
