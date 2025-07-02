-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id),
  staff_id UUID NOT NULL REFERENCES staff(id),
  content TEXT NOT NULL,
  is_from_staff BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_messages_student ON messages(student_id);
CREATE INDEX idx_messages_staff ON messages(staff_id);
