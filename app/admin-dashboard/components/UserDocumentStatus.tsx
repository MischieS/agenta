'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiFile, 
  FiClock as FiClockIcon, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle, 
  FiChevronRight, 
  FiChevronDown,
  FiDownload, 
  FiEdit2, 
  FiEye, 
  FiTrash2, 
  FiMoreVertical, 
  FiX, 
  FiSearch,
  FiFilter,
  FiPlus
} from 'react-icons/fi';
import { format } from 'date-fns';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { opacity: 0, y: -10 }
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: FiCheckCircle },
    approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400', icon: FiCheckCircle },
    pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-400', icon: FiClockIcon },
    rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: FiXCircle },
    suspended: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: FiAlertCircle },
    inactive: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', icon: FiClockIcon },
    default: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', icon: FiClockIcon }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Types definitions
interface UserDocument {
  id: string;
  userId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  lastUpdated: string;
}

export default function UserDocumentStatus() {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('documents', 'can_edit');
  const canDelete = hasPermission('documents', 'can_delete');
  
  // State for the dropdown menu
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  
  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'student' | 'staff'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended' | 'inactive'>('all');
  
  // Fetch users data from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get both students and staff from database
      const { data: studentsData, error: studentsError } = await supabase
        .from('student')
        .select('id, name, surname, email, status, updated_at, created_at')
        .order('created_at', { ascending: false });
        
      if (studentsError) {
        throw new Error(`Error fetching student data: ${studentsError.message}`);
      }
      
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, surname, email, status, updated_at, created_at')
        .order('created_at', { ascending: false });
        
      if (staffError) {
        throw new Error(`Error fetching staff data: ${staffError.message}`);
      }
      
      // Transform student data to match our User interface
      const students: User[] = studentsData ? studentsData.map(student => ({
        id: student.id,
        name: student.name || '',
        surname: student.surname || '',
        email: student.email || '',
        role: 'student',
        status: (student.status || 'pending') as 'active' | 'pending' | 'suspended' | 'inactive',
        lastUpdated: student.updated_at || student.created_at || new Date().toISOString()
      })) : [];
      
      // Transform staff data to match our User interface
      const staff: User[] = staffData ? staffData.map(member => ({
        id: member.id,
        name: member.name || '',
        surname: member.surname || '',
        email: member.email || '',
        role: 'staff',
        status: (member.status || 'pending') as 'active' | 'pending' | 'suspended' | 'inactive',
        lastUpdated: member.updated_at || member.created_at || new Date().toISOString()
      })) : [];
      
      // Combine both datasets
      const allUsers = [...students, ...staff];
      
      setUsers(allUsers);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users data: ' + err.message);
      setLoading(false);
    }
  };
  
  // No mock data fallbacks - real database only

  // Fetch documents for a user from Supabase
  const fetchUserDocuments = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get documents for this user
      const { data, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId);
        
      if (documentsError) {
        throw new Error(`Error fetching documents: ${documentsError.message}`);
      }
      
      if (data && data.length > 0) {
        // Transform data to match our interface
        const documents: UserDocument[] = data.map(doc => ({
          id: doc.id,
          userId: doc.user_id,
          documentType: doc.document_type || 'Unknown',
          fileName: doc.file_name || 'document.pdf',
          fileUrl: doc.file_url || '#',
          uploadDate: doc.upload_date || doc.created_at || new Date().toISOString(),
          status: (doc.status || 'pending') as 'pending' | 'approved' | 'rejected',
          notes: doc.notes
        }));
        
        setUserDocuments(documents);
      } else {
        // No documents found for this user
        setUserDocuments([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch user documents:', err);
      setError(`Failed to load documents for user ${userId}: ${err.message}`);
      setLoading(false);
    }
  };
  
  // No mock document data - rely solely on database

  // Update document status in Supabase
  const updateDocumentStatus = async (documentId: string, status: 'pending' | 'approved' | 'rejected', notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Update document in database
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: status,
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
        
      if (updateError) {
        throw new Error(`Error updating document status: ${updateError.message}`);
      }
      
      // Update local state
      const updatedDocuments = userDocuments.map(doc => 
        doc.id === documentId ? { ...doc, status, notes: notes || doc.notes } : doc
      );
      
      setUserDocuments(updatedDocuments);
      
      // Show success message
      setSuccess(`Document status updated to ${status}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to update document status:', err);
      setError('Failed to update document status: ' + err.message);
      setLoading(false);
    }
  };

  // Update user status in Supabase
  const updateUserStatus = async (userId: string, status: 'active' | 'pending' | 'suspended' | 'inactive') => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const selectedUser = users.find(u => u.id === userId);
      
      if (!selectedUser) {
        throw new Error('User not found');
      }
      
      let updateError;
      
      // Determine if this is a student or staff member and update appropriate table
      if (selectedUser.role === 'student') {
        const { error } = await supabase
          .from('student')
          .update({
            status: status,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        updateError = error;
      } else {
        // Assume staff - use the user table as in other components
        const { error } = await supabase
          .from('user')
          .update({
            status: status,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        updateError = error;
      }
      
      if (updateError) {
        throw new Error(`Error updating user status: ${updateError.message}`);
      }
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status, lastUpdated: new Date().toISOString() } : user
      );
      
      setUsers(updatedUsers);
      
      // Update selectedUser if it's the one being modified
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          status,
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Show success message
      setSuccess(`User status updated to ${status}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status: ' + err.message);
      setLoading(false);
    }
  };

  // Load users on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Load user documents when a user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserDocuments(selectedUser.id);
    } else {
      setUserDocuments([]);
    }
  }, [selectedUser]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Filter users based on search term, user type, and status
  const filteredUsers = users.filter(user => {
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    const matchesSearch = !searchTerm || 
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserType = userTypeFilter === 'all' || 
      (userTypeFilter === 'student' && user.role === 'student') ||
      (userTypeFilter === 'staff' && user.role === 'staff');
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesUserType && matchesStatus;
  });

  // Loading state
  if (loading && users.length === 0) {
    return <SkeletonLoader />;
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Error and Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <FiXCircle className="h-5 w-5 text-red-500 mr-3" />
              <div className="flex-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            className="p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div className="flex-1 text-sm text-green-700 dark:text-green-300">
                {success}
              </div>
              <button 
                onClick={() => setSuccess(null)}
                className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* User List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Documents</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and review user documents and statuses
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="relative dropdown-container">
            <button
              onClick={() => toggleDropdown('filters')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiFilter className="h-4 w-4 mr-2" />
              Filters
              <FiChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            <AnimatePresence>
              {openDropdown === 'filters' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        User Type
                      </label>
                      <select
                        value={userTypeFilter}
                        onChange={(e) => setUserTypeFilter(e.target.value as 'all' | 'student' | 'staff')}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Users</option>
                        <option value="student">Students</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending' | 'suspended' | 'inactive')}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* User List */}
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {filteredUsers.length === 0 ? (
          <motion.div 
            className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FiFile className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || userTypeFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new user.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New User
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer ${
                  selectedUser?.id === user.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={index * 0.1}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-1">
                          {user.name || 'Unnamed User'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{user.email}</p>
                      </div>
                    </div>
                    <div className="relative dropdown-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(`user-${user.id}`);
                        }}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                      >
                        <span className="sr-only">Open options</span>
                        <FiMoreVertical className="h-5 w-5" />
                      </button>
                      
                      <AnimatePresence>
                        {openDropdown === `user-${user.id}` && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            tabIndex={-1}
                          >
                            <div className="py-1" role="none">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'active');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                  user.status === 'active' 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                disabled={user.status === 'active'}
                              >
                                <FiCheckCircle className="inline mr-2 h-4 w-4" />
                                Set Active
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'pending');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                  user.status === 'pending' 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                disabled={user.status === 'pending'}
                              >
                                <FiClockIcon className="inline mr-2 h-4 w-4" />
                                Set Pending
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'suspended');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                  user.status === 'suspended' 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                disabled={user.status === 'suspended'}
                              >
                                <FiAlertCircle className="inline mr-2 h-4 w-4" />
                                Suspend User
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'inactive');
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                  user.status === 'inactive' 
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                disabled={user.status === 'inactive'}
                              >
                                <FiXCircle className="inline mr-2 h-4 w-4" />
                                Deactivate
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Status: </span>
                        <StatusBadge status={user.status} />
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Role: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last updated: </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(user.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* User Documents */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Documents for {selectedUser?.name || 'User'}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="h-3.5 w-3.5 mr-1" />
                Close
              </button>
            </div>
            
            {userDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This user hasn't uploaded any documents yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        File
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                      {canEdit && (
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userDocuments.map((doc, index) => (
                      <motion.tr 
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.documentType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={doc.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                          >
                            <FiDownload className="mr-1.5 h-4 w-4" />
                            {doc.fileName}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(doc.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {doc.notes || '-'}
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="inline-block relative group">
                              <button
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FiEdit2 className="h-3.5 w-3.5 mr-1.5" />
                                Update
                              </button>
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-200 dark:border-gray-700">
                                <button
                                  onClick={() => updateDocumentStatus(doc.id, 'approved', 'Document approved')}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    doc.status === 'approved' 
                                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  disabled={doc.status === 'approved'}
                                >
                                  <FiCheckCircle className="inline mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateDocumentStatus(doc.id, 'pending', 'Document set to pending')}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    doc.status === 'pending' 
                                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  disabled={doc.status === 'pending'}
                                >
                                  <FiClockIcon className="inline mr-2 h-4 w-4 text-yellow-500" />
                                  Set Pending
                                </button>
                                <button
                                  onClick={() => updateDocumentStatus(doc.id, 'rejected', 'Document rejected')}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    doc.status === 'rejected' 
                                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  disabled={doc.status === 'rejected'}
                                >
                                  <FiXCircle className="inline mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
