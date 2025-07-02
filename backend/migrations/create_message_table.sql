-- Create message table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.message (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_message_sender_id ON public.message(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_receiver_id ON public.message(receiver_id);
CREATE INDEX IF NOT EXISTS idx_message_is_read ON public.message(is_read);
