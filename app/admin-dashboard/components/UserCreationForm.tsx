'use client';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserCreationFormProps {
  userType: 'student' | 'staff';
  onUserCreated?: () => void;
}

export default function UserCreationForm({ userType, onUserCreated }: UserCreationFormProps) {
  const { hasPermission } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Additional fields for staff
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  
  // Generation and submission state
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Mock countries and universities for the form
  const countries = ['Turkey', 'USA', 'UK', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'China', 'Italy'];
  const universities = ['Istanbul Technical University', 'Bogazici University', 'Middle East Technical University', 'Bilkent University', 'Sabanci University'];
  const departments = ['Admissions', 'Student Affairs', 'Finance', 'Academic Affairs', 'Career Services', 'International Relations'];
  const positions = ['Coordinator', 'Officer', 'Assistant', 'Director', 'Manager'];

  // Generate a random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !surname || !email) {
      setError('Name, surname, and email are required');
      return;
    }
    
    if (!generatedPassword) {
      setError('Please generate a password first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // Here's how the API call would look like:
      
      const userData = {
        name,
        surname,
        email,
        password: generatedPassword,
        country,
        phone_number: phoneNumber,
        role: userType,
        ...(userType === 'student' ? {
          university,
        } : {
          position,
          department
        })
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating user:', userData);
      
      // Reset form
      setName('');
      setSurname('');
      setEmail('');
      setCountry('');
      setUniversity('');
      setPhoneNumber('');
      setPosition('');
      setDepartment('');
      setGeneratedPassword('');
      
      // Show success message
      setSuccess(`${userType === 'student' ? 'Student' : 'Staff member'} created successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // Call onUserCreated callback if provided
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err: any) {
      console.error('Failed to create user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has permission to create this type of user
  const canCreate = userType === 'student' 
    ? hasPermission('students', 'can_edit') 
    : hasPermission('staff', 'can_edit');
  
  if (!canCreate) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-700">
        You don't have permission to create {userType === 'student' ? 'students' : 'staff members'}.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">
        Create New {userType === 'student' ? 'Student' : 'Staff Member'}
      </h3>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 bg-green-50 border border-green-300 rounded text-green-700">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter first name"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Enter last name"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          {/* University (for students) or Department (for staff) */}
          {userType === 'student' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select university</option>
                {universities.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select position</option>
                  {positions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        
        {/* Password Generation */}
        <div className="border-t pt-4 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50"
              placeholder="Generate a random password"
            />
            <button
              type="button"
              onClick={generateRandomPassword}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A random secure password will be generated. The user will be required to change this password on first login.
          </p>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isLoading || !name || !surname || !email || !generatedPassword}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : `Create ${userType === 'student' ? 'Student' : 'Staff Member'}`}
          </button>
        </div>
      </form>
    </div>
  );
}
