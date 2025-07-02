import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    user_count?: number;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function RoleCard({ role, onEdit, onDelete, isDeleting }: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.name}</h3>
            {role.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{role.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              aria-label="Edit role"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              aria-label="Delete role"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <User className="h-4 w-4 mr-1.5" />
            <span>{role.user_count || 0} {role.user_count === 1 ? 'user' : 'users'}</span>
          </div>
          {role.created_at && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Created {new Date(role.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function RoleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="flex justify-between pt-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
