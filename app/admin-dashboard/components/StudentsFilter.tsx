'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Types for students and universities
interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  status: string;
  country: string;
  university_id?: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  student_count: number;
}

export default function StudentsFilter() {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('students', 'can_edit');
  const canDelete = hasPermission('students', 'can_delete');

  // State variables
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // List of countries and student statuses
  const [countries, setCountries] = useState<string[]>([]);
  const statuses = ['Applied', 'Accepted', 'Rejected', 'Enrolled', 'Graduated', 'Withdrawn'];
  
  // Fetch student data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API endpoint
      const response = await fetch('/api/admin/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      
      const data = await response.json();
      setStudents(data);
      
      // Extract unique countries
      const uniqueCountries = Array.from(new Set(data.map((student: Student) => student.country)));
      setCountries(uniqueCountries as string[]);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  // Fetch universities data
  const fetchUniversities = async () => {
    try {
      // This would be replaced with actual API endpoint
      const response = await fetch('/api/admin/universities');
      if (!response.ok) throw new Error('Failed to fetch universities');
      
      const data = await response.json();
      setUniversities(data);
    } catch (err: any) {
      console.error('Failed to fetch universities:', err);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchStudents();
    fetchUniversities();
  }, []);

  // Filter students based on selected filters
  const filteredStudents = students.filter(student => {
    const matchesCountry = !selectedCountry || student.country === selectedCountry;
    const matchesUniversity = !selectedUniversity || student.university_id === selectedUniversity;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCountry && matchesUniversity && matchesStatus && matchesSearch;
  });

  // Reset all filters
  const resetFilters = () => {
    setSelectedCountry('');
    setSelectedUniversity('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  // Generate random password for new students
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Add new student
  const addNewStudent = () => {
    // Generate a random password
    const password = generateRandomPassword();
    
    // Show prompt for new student details
    alert(`New student will be created with password: ${password}\n\nIf this was a real implementation, we'd show a form to collect student details.`);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students</h2>
        {canEdit && (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={addNewStudent}
          >
            Add New Student
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="font-bold text-lg">Filter Students</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Country filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* University filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Universities</option>
              {universities.map(university => (
                <option key={university.id} value={university.id}>{university.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Reset filters button */}
        <div className="flex justify-end">
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Students table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students match the selected filters
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const university = universities.find(uni => uni.id === student.university_id);
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name} {student.surname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {university?.name || 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${student.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                          student.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          student.status === 'Enrolled' ? 'bg-blue-100 text-blue-800' : 
                          student.status === 'Graduated' ? 'bg-purple-100 text-purple-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        {canEdit && (
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                        <button 
                          className="text-green-600 hover:text-green-900"
                        >
                          View Documents
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
