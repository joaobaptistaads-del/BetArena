import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured. Using placeholder client.');
  // Criar cliente placeholder para evitar erro
  export const supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    { auth: { persistSession: false } }
  );
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
