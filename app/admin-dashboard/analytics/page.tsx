import React from 'react';
import AdminAnalytics from '../components/AdminAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-heading font-bold mb-2">Analytics Dashboard</h1>
        <p className="admin-muted mb-6">
          View comprehensive metrics and data visualization about students, universities, and performance trends.
        </p>
      </div>
      
      <AdminAnalytics />
    </div>
  );
}
