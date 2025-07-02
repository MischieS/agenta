'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Types for universities
interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  student_count: number;
}

export default function UniversitiesFilter() {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('universities', 'can_edit');
  const canDelete = hasPermission('universities', 'can_delete');

  // State variables
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'student_count'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // List of countries
  const [countries, setCountries] = useState<string[]>([]);
  
  // Fetch universities data
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API endpoint
      const response = await fetch('/api/admin/universities');
      if (!response.ok) throw new Error('Failed to fetch universities');
      
      const data = await response.json();
      setUniversities(data);
      
      // Extract unique countries
      const uniqueCountries = Array.from(new Set(data.map((uni: University) => uni.country)));
      setCountries(uniqueCountries as string[]);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch universities');
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchUniversities();
  }, []);

  // Filter and sort universities based on selected filters
  const filteredUniversities = universities
    .filter(university => {
      const matchesCountry = !selectedCountry || university.country === selectedCountry;
      const matchesSearch = !searchTerm || 
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        university.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCountry && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else { // sortBy === 'student_count'
        return sortOrder === 'asc'
          ? a.student_count - b.student_count
          : b.student_count - a.student_count;
      }
    });

  // Reset all filters
  const resetFilters = () => {
    setSelectedCountry('');
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Toggle sort order
  const toggleSort = (field: 'name' | 'student_count') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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
        <h2 className="text-2xl font-bold">Universities</h2>
        {canEdit && (
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add New University
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="font-bold text-lg">Filter Universities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or city"
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
          
          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSort('name')}
                className={`px-3 py-1 rounded ${sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('student_count')}
                className={`px-3 py-1 rounded ${sortBy === 'student_count' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Student Count {sortBy === 'student_count' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
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

      {/* Universities cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUniversities.length === 0 ? (
          <div className="col-span-full p-4 bg-gray-50 border rounded text-center text-gray-500">
            No universities match the selected filters
          </div>
        ) : (
          filteredUniversities.map(university => (
            <div key={university.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{university.name}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p>{university.city}, {university.country}</p>
                  <p className="font-semibold mt-2">{university.student_count} Students</p>
                </div>
                
                {/* Student distribution progress bar (just for visual appeal) */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (university.student_count / 10) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    View Students
                  </button>
                  
                  {canEdit && (
                    <button 
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  )}
                  
                  {canDelete && (
                    <button 
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
