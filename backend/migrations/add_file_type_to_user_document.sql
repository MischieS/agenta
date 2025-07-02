-- Migration: Add file_type column to user_document for test compatibility
ALTER TABLE public.user_document ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);

-- Backfill file_type from document_type if file_type is null (optional, for test consistency)
UPDATE public.user_document SET file_type = document_type WHERE file_type IS NULL AND document_type IS NOT NULL;
