-- Create staff table or update it with required columns
CREATE TABLE IF NOT EXISTS public.staff (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  role_id INTEGER REFERENCES public.role(id),
  university_id INTEGER REFERENCES public.university(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If table already exists, add missing columns
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES public.role(id);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS university_id INTEGER REFERENCES public.university(id);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_staff_role_id ON public.staff(role_id);
CREATE INDEX IF NOT EXISTS idx_staff_university_id ON public.staff(university_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON public.staff(is_active);
