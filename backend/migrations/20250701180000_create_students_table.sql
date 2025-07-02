-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  degree_type TEXT NOT NULL,
  departments TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending',
  assigned_staff_id UUID REFERENCES staff(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_assigned_staff ON students(assigned_staff_id);
