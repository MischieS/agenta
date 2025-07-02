-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  country TEXT,
  university TEXT,
  university_id UUID,
  assigned_staff_id UUID,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT,
  position TEXT,
  student_count INTEGER DEFAULT 0,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sample data for testing
INSERT INTO public.staff (name, email, department, position) VALUES
('John Doe', 'john.doe@eduturkia.com', 'Academic Affairs', 'Advisor'),
('Jane Smith', 'jane.smith@eduturkia.com', 'Student Services', 'Coordinator'),
('Michael Johnson', 'michael.johnson@eduturkia.com', 'International Relations', 'Director')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.students (name, email, country, university) VALUES
('Alice Brown', 'alice.brown@example.com', 'Finland', 'University of Helsinki'),
('Bob Wilson', 'bob.wilson@example.com', 'Sweden', 'Stockholm University'),
('Charlie Davis', 'charlie.davis@example.com', 'Norway', 'University of Oslo'),
('Diana Evans', 'diana.evans@example.com', 'Denmark', 'University of Copenhagen'),
('Ethan Foster', 'ethan.foster@example.com', 'Finland', 'Aalto University')
ON CONFLICT (email) DO NOTHING;
