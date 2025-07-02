'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { RoleCard, RoleCardSkeleton } from './components/RoleCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Lazy load the feature assignment table
const RoleFeatureAssignmentTable = dynamic(
  () => import('./RoleFeatureAssignmentTable'), 
  { 
    ssr: false,
    loading: () => (
      <div className="mt-6 p-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center">
        <Loader2 className="h-6 w-6 mx-auto animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading role features...</p>
      </div>
    )
  }
);

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  user_count?: number;
}

interface RoleFormData {
  name: string;
  description: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const supabase = createClient();

  // Memoize supabase client and toast to prevent unnecessary recreations
  const memoizedSupabase = useMemo(() => supabase, []);
  const memoizedToast = useMemo(() => ({
    toast: toast,
  }), []);

  // Fetch roles with user counts
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get roles with user counts using a join
      const { data, error } = await memoizedSupabase
        .from('roles')
        .select(`
          *,
          user_roles(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Role interface
      const rolesWithCounts = data.map((role: any) => ({
        ...role,
        user_count: role.user_roles?.[0]?.count || 0
      }));

      setRoles(rolesWithCounts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
      memoizedToast.toast({
        title: 'Error',
        description: 'Failed to load roles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [memoizedSupabase, memoizedToast]);

  // Initial data fetch with cleanup
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await fetchRoles();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchRoles]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setError(null);
    setEditingRole(null);
  };

  // Open add role dialog
  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  // Open edit role dialog
  const openEditDialog = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description
    });
    setEditingRole(role);
    setShowAddDialog(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  // Handle role submission (add/edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingRole) {
        // Update existing role
        const { data, error } = await supabase
          .from('roles')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRole.id)
          .select()
          .single();

        if (error) throw error;
        
        // Update the roles list
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...data, user_count: editingRole.user_count } 
            : role
        ));

        toast({
          title: 'Success',
          description: 'Role updated successfully',
        });
      } else {
        // Create new role
        const { data, error } = await supabase
          .from('roles')
          .insert([{ 
            name: formData.name.trim(),
            description: formData.description.trim()
          }])
          .select()
          .single();

        if (error) throw error;
        
        // Add the new role to the list
        setRoles(prev => [{ ...data, user_count: 0 }, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Role created successfully',
        });
      }
      
      setShowAddDialog(false);
      resetForm();
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role deletion
  const handleDelete = async () => {
    if (!selectedRole) return;
    
    setIsDeleting(true);
    setError(null);

    try {
      // Check if role has users assigned
      if (selectedRole.user_count && selectedRole.user_count > 0) {
        throw new Error('Cannot delete role with assigned users');
      }

      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', selectedRole.id);

      if (error) throw error;
      
      // Remove the role from the list
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete role';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Role Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage user roles and their permissions.
        </p>
      </div>

      {/* Search and Add Role */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search roles..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openAddDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        /* Empty State */
        filteredRoles.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new role.
            </p>
            <div className="mt-6">
              <Button onClick={openAddDialog}>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Role
              </Button>
            </div>
          </div>
        ) : (
          /* Roles Grid */
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => openEditDialog(role)}
                  onDelete={() => openDeleteDialog(role)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )
      )}

      {/* Feature Assignment Table */}
      {!loading && roles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Role Permissions
          </h2>
          <RoleFeatureAssignmentTable roles={roles} />
        </div>
      )}

      {/* Add/Edit Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </DialogTitle>
              <DialogDescription>
                {editingRole 
                  ? 'Update the role details below.'
                  : 'Create a new role with the details below.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Administrator"
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief description of the role"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingRole ? 'Updating...' : 'Creating...'}
                  </>
                ) : editingRole ? (
                  'Update Role'
                ) : (
                  'Create Role'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    {selectedRole?.user_count ? (
                      `This role is assigned to ${selectedRole.user_count} user(s). You cannot delete a role that is assigned to users.`
                    ) : (
                      "This action will permanently delete the role and cannot be undone."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || (selectedRole?.user_count || 0) > 0}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Role'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
