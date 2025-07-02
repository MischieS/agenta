-- Create student table or update it with required columns
CREATE TABLE IF NOT EXISTS public.student (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  student_id VARCHAR(50) UNIQUE,
  phone VARCHAR(50),
  university_id INTEGER REFERENCES public.university(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If table already exists, add missing columns
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS university_id INTEGER REFERENCES public.university(id);
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.student ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_student_university_id ON public.student(university_id);
CREATE INDEX IF NOT EXISTS idx_student_email ON public.student(email);
CREATE INDEX IF NOT EXISTS idx_student_student_id ON public.student(student_id);
CREATE INDEX IF NOT EXISTS idx_student_is_active ON public.student(is_active);
