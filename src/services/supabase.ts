import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kosbdjeqzymsofsnionp.supabase.co';

export const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type PetRow = {
  id: string;
  name: string;
  species?: string | null;
  breed?: string | null;
  age?: string | null;
  birth_date?: string | null;
  photo_url?: string | null;
  health_status?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type PlantFavoriteRow = {
  id: string;
  plant_id: string;
  user_id: string;
  created_at?: string;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string, fullName = 'Petziq User') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        pet_name: fullName.split(' ')[0] || 'My Pet',
      },
    },
  });

  return { data, error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function getPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPets error:', error.message);
    return [] as PetRow[];
  }

  return (data ?? []) as PetRow[];
}

export async function getPlantFavorites() {
  const { data, error } = await supabase.from('plant_favorites').select('*');

  if (error) {
    console.error('getPlantFavorites error:', error.message);
    return [] as PlantFavoriteRow[];
  }

  return (data ?? []) as PlantFavoriteRow[];
}
