// Dashboard API utility functions

/**
 * Base API fetcher with error handling
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Use relative URL for API endpoints
    const baseUrl = '/api';
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Types for API responses
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  universityId: string;
  universityName: string;
  programId: string;
  programName: string;
  status: 'draft' | 'in-progress' | 'submitted' | 'accepted' | 'rejected';
  submittedAt?: string;
  deadline: string;
  documentsUploaded: number;
  documentsRequired: number;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'verified' | 'pending' | 'rejected';
  url: string;
}

// Mock data for development until backend is connected
export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+90 555 123 4567',
  address: '123 Main Street, Apartment 4B, Istanbul',
  bio: 'International student pursuing Bachelor\'s degree in Computer Engineering',
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-06-10T14:45:00Z',
};

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    universityId: 'univ-1',
    universityName: 'Istanbul University',
    programId: 'prog-1',
    programName: 'Computer Engineering',
    status: 'in-progress',
    deadline: '2025-07-30T23:59:59Z',
    documentsUploaded: 7,
    documentsRequired: 10,
    createdAt: '2025-06-01T09:15:00Z',
    updatedAt: '2025-06-15T16:30:00Z',
  },
  {
    id: 'app-2',
    userId: 'user-1',
    universityId: 'univ-2',
    universityName: 'Ankara University',
    programId: 'prog-2',
    programName: 'Medical School',
    status: 'submitted',
    submittedAt: '2025-06-10T14:20:00Z',
    deadline: '2025-07-15T23:59:59Z',
    documentsUploaded: 10,
    documentsRequired: 10,
    createdAt: '2025-05-20T11:45:00Z',
    updatedAt: '2025-06-10T14:20:00Z',
  },
  {
    id: 'app-3',
    userId: 'user-1',
    universityId: 'univ-3',
    universityName: 'Boğaziçi University',
    programId: 'prog-3',
    programName: 'Computer Science',
    status: 'draft',
    deadline: '2025-08-15T23:59:59Z',
    documentsUploaded: 3,
    documentsRequired: 8,
    createdAt: '2025-06-20T16:10:00Z',
    updatedAt: '2025-06-20T16:10:00Z',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    name: 'Passport.pdf',
    type: 'Identification',
    size: 2.4 * 1024 * 1024, // 2.4 MB
    uploadDate: '2025-05-20T10:15:00Z',
    status: 'verified',
    url: '/documents/passport.pdf',
  },
  {
    id: 'doc-2',
    userId: 'user-1',
    name: 'Transcript.pdf',
    type: 'Educational',
    size: 1.8 * 1024 * 1024, // 1.8 MB
    uploadDate: '2025-05-22T14:30:00Z',
    status: 'verified',
    url: '/documents/transcript.pdf',
  },
  {
    id: 'doc-3',
    userId: 'user-1',
    name: 'EnglishCertificate.pdf',
    type: 'Language',
    size: 980 * 1024, // 980 KB
    uploadDate: '2025-05-25T09:45:00Z',
    status: 'verified',
    url: '/documents/english-certificate.pdf',
  },
  {
    id: 'doc-4',
    userId: 'user-1',
    name: 'RecommendationLetter.pdf',
    type: 'Reference',
    size: 750 * 1024, // 750 KB
    uploadDate: '2025-06-01T16:20:00Z',
    status: 'pending',
    url: '/documents/recommendation-letter.pdf',
  },
  {
    id: 'doc-5',
    userId: 'user-1',
    name: 'StatementOfPurpose.pdf',
    type: 'Personal',
    size: 620 * 1024, // 620 KB
    uploadDate: '2025-06-05T11:10:00Z',
    status: 'pending',
    url: '/documents/statement-of-purpose.pdf',
  },
  {
    id: 'doc-6',
    userId: 'user-1',
    name: 'CV.pdf',
    type: 'Personal',
    size: 1.2 * 1024 * 1024, // 1.2 MB
    uploadDate: '2025-06-10T13:40:00Z',
    status: 'rejected',
    url: '/documents/cv.pdf',
  },
  {
    id: 'doc-7',
    userId: 'user-1',
    name: 'BirthCertificate.pdf',
    type: 'Identification',
    size: 1.5 * 1024 * 1024, // 1.5 MB
    uploadDate: '2025-06-15T10:30:00Z',
    status: 'verified',
    url: '/documents/birth-certificate.pdf',
  },
];

// API service functions - these will connect to real API endpoints when backend is ready

import { supabase } from "./supabaseClient";

export async function getUserProfile(): Promise<UserProfile> {
  if (!supabase) return Promise.resolve(mockUserProfile);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .single();
  if (error || !data) return Promise.resolve(mockUserProfile);
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    bio: data.bio,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getUserApplications(): Promise<Application[]> {
  if (!supabase) return Promise.resolve(mockApplications);
  const { data, error } = await supabase
    .from('applications')
    .select('*');
  if (error || !data) return Promise.resolve(mockApplications);
  return data.map((app: any) => ({
    id: app.id,
    userId: app.user_id,
    universityId: app.university_id,
    universityName: app.university_name,
    programId: app.program_id,
    programName: app.program_name,
    status: app.status,
    submittedAt: app.submitted_at,
    deadline: app.deadline,
    documentsUploaded: app.documents_uploaded,
    documentsRequired: app.documents_required,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
  }));
}

export async function getUserDocuments(): Promise<Document[]> {
  if (!supabase) return Promise.resolve(mockDocuments);
  const { data, error } = await supabase
    .from('documents')
    .select('*');
  if (error || !data) return Promise.resolve(mockDocuments);
  return data.map((doc: any) => ({
    id: doc.id,
    userId: doc.user_id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    uploadDate: doc.upload_date,
    status: doc.status,
    url: doc.url,
  }));
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  // For now, return mock data
  // When backend is ready: return fetchApi<UserProfile>('/user/profile', { method: 'PUT', body: JSON.stringify(profile) });
  return Promise.resolve({
    ...mockUserProfile,
    ...profile,
    updatedAt: new Date().toISOString(),
  });
}

// Add more API functions as needed
