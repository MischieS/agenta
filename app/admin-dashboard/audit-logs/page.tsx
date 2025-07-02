'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, RefreshCw, Clock, User, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  created_at: string;
  details?: string;
  status?: 'success' | 'error' | 'info';
}

const statusIcons = {
  success: <CheckCircle className="w-4 h-4 text-green-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

const LogCard = ({ log }: { log: AuditLog }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
  >
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-full ${
            log.status === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/50' :
            log.status === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/50' :
            'bg-blue-100 text-blue-600 dark:bg-blue-900/50'
          }`}>
            {log.status ? statusIcons[log.status] : <Info className="w-4 h-4" />}
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">{log.action}</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
        </span>
      </div>
      
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex items-start">
        <div className="flex-1">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            <User className="h-4 w-4 mr-1.5" />
            {log.user}
          </div>
          {log.details && (
            <div className="flex items-start mt-2">
              <Info className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300">{log.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24" />
    ))}
  </div>
);

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const supabase = createClient();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (searchQuery) {
        query = query.or(`action.ilike.%${searchQuery}%,user.ilike.%${searchQuery}%,details.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Add mock status for demonstration
      const statuses: Array<'success' | 'error' | 'info'> = ['success', 'error', 'info'];
      const logsWithStatus = data?.map(log => ({
        ...log,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      })) || [];
      
      setLogs(logsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, supabase]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed fetchLogs from dependencies to prevent infinite loop

  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Track and review all system activities and user actions
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-200">
                <p className="font-medium">Error loading logs</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {loading ? (
              <SkeletonLoader />
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <AlertCircle className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No logs found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <LogCard key={log.id} log={log} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
