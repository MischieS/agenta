"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiFileText, FiSearch, FiFilter, FiDownload, FiCheckCircle, FiXCircle, FiClock, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi';
import UserDocumentStatus from '../components/UserDocumentStatus';

export default function UserDocumentsPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-10" variants={itemVariants}>
        <div className="flex items-center mb-2">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
            <FiFileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Documents & Status
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
              Efficiently manage and review user documents with our intuitive dashboard. 
              Filter, search, and update document statuses with ease.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          whileHover={{ y: -5 }}
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">1,248</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <FiUsers size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          whileHover={{ y: -5 }}
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">47</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <FiClock size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          whileHover={{ y: -5 }}
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved Today</p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">23</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
        variants={itemVariants}
      >
        {/* Header with search and filters */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search users or documents..."
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiFilter className="h-4 w-4 mr-2" />
                Filters
                {isFiltersOpen ? (
                  <FiChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <FiChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Export Data
                <FiDownload className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Type</label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>All Users</option>
                      <option>Students</option>
                      <option>Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Status</label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>All Documents</option>
                      <option>Pending Review</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main content area */}
        <div className="p-6">
          <UserDocumentStatus />
        </div>
      </motion.div>

      {/* Quick Actions Floating Button */}
      <motion.div 
        className="fixed bottom-8 right-8 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <FiPlus className="h-6 w-6" />
        </button>
      </motion.div>
    </motion.div>
  );
}
