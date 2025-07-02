-- Create user_document table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_document (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  file_path TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_document_user_id ON public.user_document(user_id);
CREATE INDEX IF NOT EXISTS idx_user_document_status ON public.user_document(status);
CREATE INDEX IF NOT EXISTS idx_user_document_type ON public.user_document(document_type);
