/**
 * API Response Types
 * Defines the structure of API responses from our backend
 */

// Base API response type that all responses extend
export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

// Authentication response types
export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface UserData {
  id: string;
  email: string;
  isStudent: boolean;
  user?: StaffUser;
  student?: Student;
  token?: string;
}

// User types
export interface BaseUser {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffUser extends BaseUser {
  role: 'admin' | 'staff';
}

export interface Student extends BaseUser {
  phone?: string;
  birthdate?: string;
  country?: string;
  address?: string;
  status?: 'pending' | 'assigned' | 'active' | 'completed';
  degreeType?: string;
  selectedDepartments?: string[];
  assignedStaffId?: string;
}

// Student submission type
export interface StudentSubmission {
  name: string;
  email: string;
  degreeType: string;
  selectedDepartments: string[];
}

// Message types
export interface Message {
  id: string;
  studentId: string;
  staffId?: string;
  content: string;
  isFromStaff: boolean;
  createdAt: string;
}

// API Error type
export interface ApiError {
  message: string;
  statusCode?: number;
}
