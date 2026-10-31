-- Supabase SQL schema for Music Player Playlist
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public read access so visitors can listen to songs
CREATE POLICY "Allow public read access to songs" 
  ON public.songs 
  FOR SELECT 
  TO public 
  USING (true);

-- 4. Sample insert statement (replace src with your actual Supabase storage public URL)
-- INSERT INTO public.songs (title, artist, duration, src, cover_label, order_index)
-- VALUES (
--   'Lofi Sunset',
--   'Studio Vibes',
--   180,
--   'https://your-project.supabase.co/storage/v1/object/public/songs/sample.mp3',
--   'LO-FI / CHILL',
--   1
-- );

