'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Lock, Camera, Check, X, Loader2, AlertCircle, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  profile_pic?: string;
  updated_at?: string;
  role?: string;
  phone?: string;
  bio?: string;
}

type ActiveTab = 'profile' | 'security' | 'preferences';

const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-gray-200' };
    
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    
    const strength = [hasMinLength, hasNumber, hasSpecialChar, hasUpperCase].filter(Boolean).length;
    
    switch (strength) {
      case 1: return { width: '25%', color: 'bg-red-500' };
      case 2: return { width: '50%', color: 'bg-yellow-500' };
      case 3: return { width: '75%', color: 'bg-blue-500' };
      case 4: return { width: '100%', color: 'bg-green-500' };
      default: return { width: '0%', color: 'bg-gray-200' };
    }
  };
  
  const { width, color } = getPasswordStrength();
  
  return (
    <div className="mt-1">
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ease-in-out ${color}`}
          style={{ width }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {password ? 'Password strength' : 'Enter a password to check strength'}
      </p>
    </div>
  );
};

export default function ProfilePage() {
  const [currentUserId] = useState<string>('00000000-0000-0000-0000-000000000001');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUserId)
        .single();
        
      if (error) throw error;
      
      setProfile(data || null);
      setName(data?.name || '');
      setSurname(data?.surname || '');
      setEmail(data?.email || '');
      setPhone(data?.phone || '');
      setBio(data?.bio || '');
      setProfilePic(data?.profile_pic || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          name, 
          surname, 
          email, 
          phone,
          bio,
          profile_pic: profilePic, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', currentUserId);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { 
        ...prev, 
        name, 
        surname, 
        email, 
        phone,
        bio,
        profile_pic: profilePic, 
        updated_at: new Date().toISOString() 
      } : null);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Failed to update password. Please check your current password and try again.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, you would upload to a storage bucket
      // For demo, we'll just create a local URL
      const fileUrl = URL.createObjectURL(file);
      setProfilePic(fileUrl);
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
                  </div>
                </div>
              </motion.div>
          )}

          {passwordSuccess && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-200">{passwordSuccess}</p>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your account information and security settings
            </p>
          </div>
          {profile?.updated_at && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated {formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="md:flex">
            {/* Sidebar Navigation */}
            <div className="md:w-56 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="p-6 md:p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
                      {profilePic ? (
                        <img 
                          src={profilePic} 
                          alt={name || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="font-medium text-gray-900 dark:text-white truncate">
                      {name} {surname}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {profile?.role || 'Administrator'}
                    </p>
                  </div>
                </div>
              </div>
              
              <nav className="px-2 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'profile' && (
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Update your account's profile information and email address.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              First Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                id="name"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="surname"
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              value={surname}
                              onChange={(e) => setSurname(e.target.value)}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Bio
                            </label>
                            <textarea
                              id="bio"
                              rows={3}
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              A brief description of yourself
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Ensure your account is using a long, random password to stay secure.
                          </p>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Password
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                type="password"
                                id="current-password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="new-password"
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              autoComplete="new-password"
                              required
                            />
                            <PasswordStrengthMeter password={newPassword} />
                          </div>

                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              autoComplete="new-password"
                              required
                            />
                          </div>

                          {passwordError && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <X className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700 dark:text-red-200">{passwordError}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                  Updating...
                                </>
                              ) : 'Update Password'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeTab === 'preferences' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Configure how information is displayed on your account.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="dark-mode"
                                name="dark-mode"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                defaultChecked={false}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="dark-mode" className="font-medium text-gray-700 dark:text-gray-300">
                                Dark Mode
                              </label>
                              <p className="text-gray-500 dark:text-gray-400">
                                Switch between light and dark theme.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="notifications"
                                name="notifications"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                defaultChecked={true}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="notifications" className="font-medium text-gray-700 dark:text-gray-300">
                                Email Notifications
                              </label>
                              <p className="text-gray-500 dark:text-gray-400">
                                Receive email notifications about important updates.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="marketing"
                                name="marketing"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                defaultChecked={false}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="marketing" className="font-medium text-gray-700 dark:text-gray-300">
                                Marketing Emails
                              </label>
                              <p className="text-gray-500 dark:text-gray-400">
                                Receive marketing emails about new features and products.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
