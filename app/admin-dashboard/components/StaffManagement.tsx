'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';

// Interface for staff member
interface StaffMember {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  department: string;
  position: string;
  role: string;
  joined_date: string;
  student_count: number;
}

export default function StaffManagement() {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('staff', 'can_edit');
  const canDelete = hasPermission('staff', 'can_delete');
  
  // State variables
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    department: '',
    position: ''
  });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // Available departments and positions
  const departments = ['Student Affairs', 'Admissions', 'Academic Affairs', 'Career Services', 'International Relations'];
  const positions = ['Director', 'Manager', 'Coordinator', 'Officer', 'Assistant'];

  // Fetch staff data from Supabase
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get staff members from database
      const { data, error: fetchError } = await supabase
        .from('staff')
        .select('*, students(id)');
      
      if (fetchError) {
        throw new Error(`Error fetching staff data: ${fetchError.message}`);
      }
      
      if (data && data.length > 0) {
        // Transform data to match our interface
        const staffData: StaffMember[] = data.map(item => ({
          id: item.id || '',
          name: item.name || '',
          surname: item.surname || '',
          email: item.email || '',
          phone_number: item.phone_number || '',
          department: item.department || '',
          position: item.position || '',
          role: item.role || 'staff',
          joined_date: item.created_at || new Date().toISOString(),
          student_count: Array.isArray(item.students) ? item.students.length : 0
        }));
        
        setStaff(staffData);
      } else {
        // If no data found, use mock data as fallback
        console.log('No staff data found in database, using fallback mock data');
        useMockData();
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch staff:', err);
      setError('Failed to load staff data: ' + err.message);
      setLoading(false);
      
      // Use mock data as fallback on error
      useMockData();
    }
  };
  
  // Fallback to mock data
  const useMockData = () => {
    const mockStaff: StaffMember[] = [
      { 
        id: '201', 
        name: 'Robert', 
        surname: 'Smith',
        email: 'robert@example.com', 
        phone_number: '+90 555 123 4567',
        department: 'Student Affairs', 
        position: 'Manager',
        role: 'manager',
        joined_date: '2024-03-15T00:00:00Z',
        student_count: 2
      },
      { 
        id: '202', 
        name: 'Patricia', 
        surname: 'Anderson',
        email: 'patricia@example.com', 
        phone_number: '+90 555 234 5678',
        department: 'Career Services', 
        position: 'Manager',
        role: 'manager',
        joined_date: '2024-02-10T00:00:00Z',
        student_count: 1
      },
      { 
        id: '203', 
        name: 'Michael', 
        surname: 'Brown',
        email: 'michael@example.com', 
        phone_number: '+90 555 345 6789',
        department: 'Academic Affairs', 
        position: 'Director',
        role: 'chief',
        joined_date: '2023-11-05T00:00:00Z',
        student_count: 0
      },
      { 
        id: '204', 
        name: 'Elizabeth', 
        surname: 'Moore',
        email: 'elizabeth@example.com', 
        phone_number: '+90 555 456 7890',
        department: 'Admissions', 
        position: 'Coordinator',
        role: 'sales',
        joined_date: '2024-01-20T00:00:00Z',
        student_count: 3
      },
      { 
        id: '205', 
        name: 'Richard', 
        surname: 'Wilson',
        email: 'richard@example.com', 
        phone_number: '+90 555 567 8901',
        department: 'International Relations', 
        position: 'Officer',
        role: 'sales',
        joined_date: '2024-04-02T00:00:00Z',
        student_count: 2
      },
    ];
    
    setStaff(mockStaff);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Start editing a staff member
  const startEditing = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      surname: staffMember.surname,
      email: staffMember.email,
      phone_number: staffMember.phone_number,
      department: staffMember.department,
      position: staffMember.position
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setSelectedStaff(null);
    setIsEditing(false);
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone_number: '',
      department: '',
      position: ''
    });
  };

  // Save staff changes to Supabase
  const saveStaffChanges = async () => {
    if (!selectedStaff) return;
    
    if (!formData.name || !formData.surname || !formData.email) {
      setError('Name, surname, and email are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Update staff in database
      const { error: updateError } = await supabase
        .from('staff')
        .update({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone_number: formData.phone_number,
          department: formData.department,
          position: formData.position,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedStaff.id);
      
      if (updateError) {
        throw new Error(`Error updating staff: ${updateError.message}`);
      }
      
      // Update local state
      const updatedStaff = staff.map(s => 
        s.id === selectedStaff.id 
          ? { 
              ...s, 
              name: formData.name,
              surname: formData.surname,
              email: formData.email,
              phone_number: formData.phone_number,
              department: formData.department,
              position: formData.position
            } 
          : s
      );
      
      setStaff(updatedStaff);
      setSelectedStaff(null);
      setIsEditing(false);
      
      // Reset form
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        department: '',
        position: ''
      });
      
      // Show success message
      setSuccess('Staff information updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to update staff:', err);
      setError(err.message || 'Failed to update staff information');
      setLoading(false);
    }
  };

  // Delete staff member from Supabase
  const deleteStaffMember = async (staffId: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Delete staff member from database
      const { error: deleteError } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId);
      
      if (deleteError) {
        throw new Error(`Error deleting staff member: ${deleteError.message}`);
      }
      
      // Update local state
      const updatedStaff = staff.filter(s => s.id !== staffId);
      setStaff(updatedStaff);
      
      // Show success message
      setSuccess('Staff member deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to delete staff:', err);
      setError(err.message || 'Failed to delete staff member: ' + err.message);
      setLoading(false);
    }
  };

  // Load staff on initial render
  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter staff based on search term and department
  const filteredStaff = staff.filter(s => {
    const fullName = `${s.name} ${s.surname}`.toLowerCase();
    const matchesSearch = !searchTerm || 
      fullName.includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || s.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading && staff.length === 0) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700">
          {error}
          <button 
            className="ml-2 text-red-900 hover:underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded text-green-700">
          {success}
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, position"
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Department filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {/* Reset filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Staff List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold">Staff Members ({filteredStaff.length})</h3>
        </div>
        
        {isEditing && selectedStaff ? (
          <div className="p-6 border-b">
            <h4 className="text-md font-semibold mb-4">Edit Staff Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              {/* Surname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveStaffChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : null}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No staff members match the selected filters
                  </td>
                </tr>
              ) : (
                filteredStaff.map(staffMember => (
                  <tr key={staffMember.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
                          {staffMember.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staffMember.name} {staffMember.surname}</div>
                          <div className="text-sm text-gray-500">{staffMember.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffMember.email}</div>
                      <div className="text-sm text-gray-500">{staffMember.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffMember.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${staffMember.role === 'chief' ? 'bg-purple-100 text-purple-800' : 
                          staffMember.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {staffMember.role.charAt(0).toUpperCase() + staffMember.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(staffMember.joined_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffMember.student_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {canEdit && (
                          <button
                            onClick={() => startEditing(staffMember)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => deleteStaffMember(staffMember.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
