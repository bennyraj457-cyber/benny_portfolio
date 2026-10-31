import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://qqercwgubhklohlgtddk.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZXJjd2d1YmhrbG9obGd0ZGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDE0MjgsImV4cCI6MjEwODk3NzQyOH0.Yjs_9Lh-XlG7vE9DKsx4_GwrhgF8PNk6qxXw5w_5YAo'

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project'),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

