-- Run this in Supabase Dashboard → SQL Editor if auto-create fails.
-- Creates the table that tracks which Git images have been migrated to Supabase Storage.

CREATE TABLE IF NOT EXISTS project_files (
  id            SERIAL PRIMARY KEY,
  local_path    TEXT NOT NULL UNIQUE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  bucket        TEXT NOT NULL DEFAULT 'project-files',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended)
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

-- Allow public read (website only reads URLs)
CREATE POLICY "Public read" ON project_files
  FOR SELECT TO anon USING (true);
