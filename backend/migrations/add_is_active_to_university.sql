-- Add is_active column to university table with default true
ALTER TABLE university ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing records to have is_active=true if null
UPDATE university SET is_active = TRUE WHERE is_active IS NULL;
