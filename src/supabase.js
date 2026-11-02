import { createClient } from '@supabase/supabase-js';

// Retrieve from localStorage (for live in-browser entry) or environment variables
const getInitialSupabaseConfig = () => {
  try {
    const saved = localStorage.getItem('wforge_supabase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opajjftspvftmebwratn.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYWpqZnRzcHZmdG1lYndyYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NzE4MDIsImV4cCI6MjEwOTE0NzgwMn0.tFKc1KvknlFn6c0vmje537fSfL-B4-tA3czdsWj3uz8'
  };
};

export let supabaseConfig = getInitialSupabaseConfig();

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    supabaseConfig.url.includes('supabase.co') &&
    !supabaseConfig.url.includes('YOUR_')
  );
};

export let supabase = isSupabaseConfigured()
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

export const updateSupabaseConfig = (newConfig) => {
  try {
    supabaseConfig = { ...supabaseConfig, ...newConfig };
    localStorage.setItem('wforge_supabase_config', JSON.stringify(supabaseConfig));
    if (isSupabaseConfigured()) {
      supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    }
    return true;
  } catch (err) {
    console.error('Failed to update Supabase config:', err);
    return false;
  }
};

// Sign in with Google via Supabase OAuth
export const signInWithGoogleSupabase = async () => {
  if (!supabase || !isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
};

// Sign out
export const signOutSupabase = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};
