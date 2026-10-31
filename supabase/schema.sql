-- Supabase SQL schema for Portfolio Workspace
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create the songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration NUMERIC DEFAULT 0,
  src TEXT NOT NULL,
  cover_label TEXT DEFAULT 'LO-FI / CHILL',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS) for songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public read access so visitors can listen to songs
CREATE POLICY "Allow public read access to songs" 
  ON public.songs 
  FOR SELECT 
  TO public 
  USING (true);

-- 4. Create the wall_art table for dynamic framed art / posters
CREATE TABLE IF NOT EXISTS public.wall_art (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Wall Art',
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for wall_art
ALTER TABLE public.wall_art ENABLE ROW LEVEL SECURITY;

-- Allow public read access to wall_art
CREATE POLICY "Allow public read access to wall_art" 
  ON public.wall_art 
  FOR SELECT 
  TO public 
  USING (true);
