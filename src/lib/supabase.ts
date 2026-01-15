import { createClient } from '@supabase/supabase-js'

// These will be replaced by environment variables later
// For now, we'll initialize with placeholders to prevent runtime errors on load
// The app will function in "mock mode" or fail gracefully if these are not real
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
