-- Create role table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add any default roles if needed
INSERT INTO public.role (name, description, permissions)
VALUES 
  ('Administrator', 'Full system access', '{"all": true}'::jsonb),
  ('Staff', 'University staff access', '{"read": true, "write": true}'::jsonb),
  ('Student', 'Student access', '{"read": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;
