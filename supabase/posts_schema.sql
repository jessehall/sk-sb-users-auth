-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read posts (for public blog)
CREATE POLICY "Posts are publicly readable"
  ON posts FOR SELECT
  USING (true);

-- Policy: Only admins can insert posts
CREATE POLICY "Admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can update posts
CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can delete posts
CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
