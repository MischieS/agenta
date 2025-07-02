'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Loader2, UserPlus, Users, UserX, AlertCircle, CheckCircle, ChevronDown, ChevronUp, RefreshCw, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/admin-dashboard/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Types for our data
interface Student {
  id: string;
  name: string;
  email: string;
  country: string;
  university: string;
  university_id?: string;
  assigned_staff_id: string | null;
  avatar?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  student_count: number;
  avatar?: string;
  color?: string;
}

// Generate a color based on a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

export default function StudentStaffAssignment() {
  // All hooks must be called at the top level, before any conditional returns
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const { toast } = useToast();
  
  // State variables - must be declared before any conditional returns
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [targetStaffId, setTargetStaffId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverStaffId, setDragOverStaffId] = useState<string | null>(null);

  // Check if user can edit assignments
  const canEdit = user && (user.role === 'admin' || user.role === 'teacher');
  
  // Debug auth state
  useEffect(() => {
    console.log('Current auth state:', { user, loading, error });
    
    // Check Supabase session directly
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log('Direct Supabase session check:', { data, error });
    };
    
    checkSession();
  }, [user, loading, error]);

  // Debug log authentication state
  useEffect(() => {
    console.log('Auth state:', { user, loading, canEdit });
  }, [user, loading, canEdit]);

  // Handle authentication and redirects
  useEffect(() => {
    // If authentication is still loading, do nothing yet
    if (loading) return;
    
    // If no user is logged in after auth loading completes, redirect to login
    if (!loading && !user) {
      console.log('No user found, redirecting to signin');
      router.push('/admin-dashboard/signin');
      return;
    }
  }, [user, loading, router]);

  // Get unique universities and countries for filters
  const universities = useMemo(() => {
    if (!students) return [];
    const universityMap = new Map<string, { id: string; name: string }>();
    students.forEach((student: Student) => {
      if (student.university_id && student.university) {
        universityMap.set(student.university_id, {
          id: student.university_id,
          name: student.university
        });
      }
    });
    return Array.from(universityMap.values()).sort((a: { name: string }, b: { name: string }) => 
      a.name.localeCompare(b.name)
    );
  }, [students]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStaff('');
    setSelectedUniversity('');
    setSelectedCountry('');
    setUnassignedOnly(false);
  }, []);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    
    return students.filter((student: Student) => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.university && student.university.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Staff filter
      const matchesStaff = !selectedStaff || student.assigned_staff_id === selectedStaff;
      
      // University filter
      const matchesUniversity = !selectedUniversity || student.university_id === selectedUniversity;
      
      // Country filter
      const matchesCountry = !selectedCountry || 
        (student.country && student.country.toLowerCase() === selectedCountry.toLowerCase());
      
      // Unassigned filter
      const matchesUnassigned = !unassignedOnly || !student.assigned_staff_id;
      
      return matchesSearch && matchesStaff && matchesUniversity && 
             matchesCountry && matchesUnassigned;
    });
  }, [students, searchTerm, selectedStaff, selectedUniversity, selectedCountry, unassignedOnly]);

  // Fetch students and staff data
  useEffect(() => {
    // Skip fetching if not authenticated yet or already redirecting
    if (loading || !user) return;
    
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setErrorData(null);
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*');
          
        if (studentsError) {
          console.error('Error fetching students:', studentsError);
          setErrorData('Failed to load students data. Please check your database connection.');
          setLoadingData(false);
          return;
        }
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*');
          
        if (staffError) {
          console.error('Error fetching staff:', staffError);
          setErrorData('Failed to load staff data. Please check your database connection.');
          setLoadingData(false);
          return;
        }
        
        // Format and set data
        const formattedStaff = staffData ? staffData.map((staff: StaffMember) => ({
          ...staff,
          color: stringToColor(staff.id || 'default'),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(staff.name || 'U')}`,
          student_count: staff.student_count || 0
        })) : [];
        
        const formattedStudents = studentsData ? studentsData.map((student: Student) => ({
          ...student,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name || 'S')}`
        })) : [];
        
        // Update state with fetched data
        setStudents(formattedStudents);
        setStaff(formattedStaff);
        setLoadingData(false);
      } catch (err) {
        console.error('Error in data fetching:', err);
        setErrorData('An unexpected error occurred. Please try again later.');
      }
    };
    
    fetchData();
  }, [user, loading]);

  // Handle assignment of students to staff members
  const handleAssignStudents = async (studentIds: string[] = selectedStudents, staffId: string = targetStaffId) => {
    if (!studentIds.length || !staffId) {
      toast({
        title: 'Assignment Error',
        description: 'Please select students and a staff member',
        variant: 'destructive',
      });
      return false;
    }

    setIsAssigning(true);
    
    try {
      const supabase = createClient();
      
      // Update each selected student
      const { error } = await supabase
        .from('students')
        .update({ assigned_staff_id: staffId })
        .in('id', studentIds);
      
      if (error) throw error;
      
      // Update local state
      setStudents(prevStudents => {
        // Update staff counts based on previous and new assignments
        setStaff(currentStaff => 
          currentStaff.map(staffMember => {
            const assignedCount = studentIds.length;
            const wasAssigned = studentIds.some(id => 
              prevStudents.find(s => s.id === id)?.assigned_staff_id === staffMember.id
            );
            
            if (staffMember.id === staffId) {
              return { 
                ...staffMember, 
                student_count: (staffMember.student_count || 0) + (wasAssigned ? 0 : assignedCount)
              };
            } else if (wasAssigned) {
              return {
                ...staffMember,
                student_count: Math.max(0, (staffMember.student_count || 0) - assignedCount)
              };
            }
            return staffMember;
          })
        );
        
        // Return updated students
        return prevStudents.map(student => 
          studentIds.includes(student.id)
            ? { ...student, assigned_staff_id: staffId }
            : student
        );
      });
      
      setSelectedStudents([]);
      setTargetStaffId('');
      
      toast({
        title: 'Success',
        description: `Assigned ${studentIds.length} student(s) successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error assigning students:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign students',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Toggle select all students
  const toggleSelectAllStudents = useCallback(() => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  }, [filteredStudents, selectedStudents.length]);

  // Handle assign selected students
  const handleAssignSelected = useCallback(async () => {
    if (selectedStudents.length === 0 || !targetStaffId) {
      toast({
        title: 'Error',
        description: 'Please select at least one student and a staff member',
        variant: 'destructive',
      });
      return;
    }

    await handleAssignStudents(selectedStudents, targetStaffId);
  }, [selectedStudents, targetStaffId, toast]);

  // Handle error state
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-6 max-w-3xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700 space-y-2">
              <p className="font-semibold">Details:</p>
              <div className="bg-white p-3 rounded-md border border-red-200 font-mono text-xs overflow-x-auto">
                {error}
              </div>
              <p className="mt-2">
                Please check the following:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are properly authenticated</li>
                <li>Your internet connection is stable</li>
                <li>The database tables exist and are accessible</li>
                <li>You have the necessary permissions</li>
              </ul>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  console.clear();
                  console.log('Error details:', error);
                  console.log('Current state:', { students, staff, loading });
                  toast({
                    title: 'Debug Info',
                    description: 'Check the console for detailed error information',
                  });
                }}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-gray-300"
              >
                <Terminal className="mr-2 h-4 w-4" />
                Show Debug Info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student-Staff Assignment</h1>
          <p className="text-muted-foreground">
            Assign students to staff members and manage their relationships
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={!searchTerm && !selectedStaff && !selectedUniversity && !selectedCountry && !unassignedOnly}
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="staff">Staff Member</Label>
                <Select
                  value={selectedStaff}
                  onValueChange={setSelectedStaff}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Filter by staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Staff</SelectItem>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="university">University</Label>
                <Select
                  value={selectedUniversity}
                  onValueChange={setSelectedUniversity}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Filter by university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Universities</SelectItem>
                    {universities.map((uni: { id: string; name: string }) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unassigned"
                      checked={unassignedOnly}
                      onCheckedChange={(checked) => setUnassignedOnly(checked === true)}
                    />
                    <Label htmlFor="unassigned">Show unassigned only</Label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((staffMember) => (
          <motion.div
            key={staffMember.id}
            className={cn(
              'relative rounded-lg border p-4 transition-all',
              dragOverStaffId === staffMember.id
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'bg-card hover:bg-accent/50',
              isDragging && 'transition-transform duration-200'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStaffId(staffMember.id);
            }}
            onDragLeave={() => setDragOverStaffId(null)}
            onDrop={async (e) => {
              e.preventDefault();
              if (draggedStudentId) {
                await handleAssignStudents([draggedStudentId], staffMember.id);
                setDraggedStudentId(null);
                setIsDragging(false);
                setDragOverStaffId(null);
              }
            }}
            variants={fadeIn}
            layout
          >
            <div className="flex items-center space-x-3">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: staffMember.color || '#6b7280' }}
              >
                {staffMember.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">{staffMember.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{staffMember.position}</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {staffMember.student_count} students
              </Badge>
            </div>
            
            {dragOverStaffId === staffMember.id && (
              <div className="absolute inset-0 bg-primary/10 rounded-lg border-2 border-dashed border-primary flex items-center justify-center pointer-events-none">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            
            {canEdit && selectedStudents.length > 0 && (
              <div className="flex items-center space-x-2">
                <Select
                  value={targetStaffId}
                  onValueChange={setTargetStaffId}
                  disabled={isAssigning}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Assign to staff..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleAssignStudents()}
                  disabled={!targetStaffId || isAssigning}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Selected'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                      <Checkbox
                        id="select-all"
                        checked={(selectedStudents.length > 0 && selectedStudents.length === filteredStudents.length) || false}
                        onCheckedChange={toggleSelectAllStudents}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">University</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned To</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`border-b transition-colors hover:bg-muted/50 ${isDragging && draggedStudentId === student.id ? 'opacity-50' : ''}`}
                        draggable={canEdit}
                        onDragStart={(e: React.DragEvent) => {
                          e.dataTransfer.setData('studentId', student.id);
                          setDraggedStudentId(student.id);
                          setIsDragging(true);
                        }}
                        onDragEnd={() => {
                          setDraggedStudentId(null);
                          setIsDragging(false);
                        }}
                      >
                        <td className="p-4 align-middle">
                          <Checkbox
                            id={`select-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudentSelection(student.id)}
                            aria-label={`Select ${student.name}`}
                          />
                        </td>
                        <td className="p-4 align-middle font-medium">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: stringToColor(student.id) }}
                            >
                              {student.name.charAt(0)}
                            </div>
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="text-sm">
                            {student.university}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.country}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {student.assigned_staff_id ? (
                            <div className="flex items-center space-x-2">
                              <div 
                                className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ 
                                  backgroundColor: staff.find(s => s.id === student.assigned_staff_id)?.color || '#6b7280'
                                }}
                              >
                                {staff.find(s => s.id === student.assigned_staff_id)?.name.charAt(0) || '?'}
                              </div>
                              <span className="text-sm">
                                {staff.find(s => s.id === student.assigned_staff_id)?.name || 'Unknown'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4 align-middle text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStudents([student.id]);
                                const staffSelect = document.getElementById('staff-select');
                                if (staffSelect) {
                                  staffSelect.scrollIntoView({ behavior: 'smooth' });
                                  staffSelect.focus();
                                }
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Assign
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No students found. Try adjusting your filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
