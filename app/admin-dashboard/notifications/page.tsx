'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Bell, BellOff, RefreshCw, Filter, Search, Check, X, AlertCircle, AlertTriangle, Info, CheckCircle, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'system' | 'message';

interface Notification {
  id: string;
  message: string;
  recipient: string;
  created_at: string;
  read: boolean;
  type: NotificationType;
}

const notificationIcons = {
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  system: <Bell className="w-5 h-5 text-purple-500" />,
  message: <Mail className="w-5 h-5 text-indigo-500" />,
};

const notificationColors = {
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  system: 'bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
  message: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
};

const NotificationCard = ({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border ${
        notification.read 
          ? 'bg-white/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700' 
          : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900/50 shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${notificationColors[notification.type]}`}>
              {notificationIcons[notification.type] || notificationIcons.info}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.message}
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate">To: {notification.recipient}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex space-x-2"
              >
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800/50 rounded-xl h-20" />
    ))}
  </div>
);

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    type: NotificationType[];
    read: boolean | null;
  }>({ type: [], read: null });
  const [showFilters, setShowFilters] = useState(false);
  
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters.type.length > 0) {
        query = query.in('type', filters.type);
      }
      
      if (filters.read !== null) {
        query = query.eq('read', filters.read);
      }
      
      if (searchQuery) {
        query = query.or(`message.ilike.%${searchQuery}%,recipient.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Add mock data for demonstration
      const mockTypes: NotificationType[] = ['info', 'warning', 'error', 'success', 'system', 'message'];
      const notificationsWithMockData = (data || []).map(notification => ({
        ...notification,
        type: notification.type || mockTypes[Math.floor(Math.random() * mockTypes.length)],
        read: notification.read || false,
      }));
      
      setNotifications(notificationsWithMockData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, supabase]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleFilter = (type: NotificationType) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const toggleReadFilter = () => {
    setFilters(prev => ({
      ...prev,
      read: prev.read === null ? false : prev.read === false ? true : null
    }));
  };

  const clearFilters = () => {
    setFilters({ type: [], read: null });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.type.length > 0 || filters.read !== null || searchQuery;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Stay updated with system activities and messages
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(filters.type.length > 0 || filters.read !== null) && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs">
                  {filters.type.length + (filters.read !== null ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(notificationIcons).map(([type, icon]) => (
                      <button
                        key={type}
                        onClick={() => toggleFilter(type as NotificationType)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                          filters.type.includes(type as NotificationType)
                            ? 'border-transparent bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-1.5">{icon}</span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleReadFilter}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                        filters.read === false
                          ? 'border-transparent bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5 mr-1.5" />
                      Unread
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, read: true }))}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                        filters.read === true
                          ? 'border-transparent bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Read
                    </button>
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={fetchNotifications}
                    className="text-sm font-medium text-red-700 dark:text-red-200 hover:text-red-600 dark:hover:text-red-300"
                  >
                    Try again <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <SkeletonLoader />
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <BellOff className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasActiveFilters 
                ? 'No notifications match your current filters.' 
                : 'All caught up! No new notifications.'}
            </p>
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
