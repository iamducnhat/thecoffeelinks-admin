import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If we simply pass empty strings, createClient might throw or fail later. 
// However, preventing the immediate crash during module evaluation is key.
// 'createClient' generally expects a valid URL structure. 
// Let's use a dummy URL if missing during build to satisfy it, 
// ensuring it doesn't crash static generation.
// But better practice: check if they exist.

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
);
