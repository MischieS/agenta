'use client';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <h1 className="admin-heading text-3xl font-bold mb-4">Settings</h1>
      <p className="admin-muted mb-6">Configure system-wide settings and preferences for the admin dashboard.</p>
      <div className="admin-card rounded-lg shadow p-6">
        <h2 className="admin-heading text-xl font-semibold mb-2">General Settings</h2>
        <p className="admin-muted mb-4">(Settings form goes here)</p>
        <button className="admin-btn-primary px-4 py-2 rounded hover:transition">Save Changes</button>
      </div>
    </div>
  );
}
