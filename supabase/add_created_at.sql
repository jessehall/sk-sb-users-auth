-- Add created_at column to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Update existing rows to have a created_at value (set to current time if null)
UPDATE profiles 
SET created_at = timezone('utc'::text, now())
WHERE created_at IS NULL;
