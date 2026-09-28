import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or PUBLISHABLE_KEY).',
  );
}

export { supabaseUrl, supabaseAnonKey };

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

export type ReminderRow = {
  id: string;
  user_id: string;
  title: string;
  notes?: string | null;
  type?: string | null;
  due_at?: string | null;
  is_repeating?: boolean | null;
  repeat_interval?: string | null;
  is_completed?: boolean | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ActivityRow = {
  id: string;
  pet_id: string;
  user_id: string;
  activity_type: string;
  duration_minutes?: number | null;
  notes?: string | null;
  activity_date?: string | null;
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

export async function getReminders() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    console.error('getReminders auth error:', userError?.message ?? 'No authenticated user');
    return [] as ReminderRow[];
  }

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('due_at', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('getReminders error:', error.message);
    return [] as ReminderRow[];
  }

  return (data ?? []) as ReminderRow[];
}

export async function createReminder(input: Partial<ReminderRow> & Pick<ReminderRow, 'title'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return {
      data: null,
      error: userError ?? new Error('No authenticated user available for reminder creation.'),
    } as const;
  }

  const payload = {
    user_id: userId,
    title: input.title,
    notes: input.notes ?? null,
    type: input.type ?? 'custom',
    due_at: input.due_at ?? new Date().toISOString(),
    is_repeating: Boolean(input.is_repeating),
    repeat_interval: input.repeat_interval ?? null,
    is_completed: Boolean(input.is_completed),
    completed_at: input.is_completed ? input.completed_at ?? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from('reminders').insert(payload).select().single();
  return { data: (data ?? null) as ReminderRow | null, error };
}

export async function updateReminder(id: string, values: Partial<ReminderRow>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return {
      data: null,
      error: userError ?? new Error('No authenticated user available for reminder update.'),
    } as const;
  }

  const { data, error } = await supabase
    .from('reminders')
    .update(values)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  return { data: (data ?? null) as ReminderRow | null, error };
}

export async function deleteReminder(id: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return { error: userError ?? new Error('No authenticated user available for reminder deletion.') };
  }

  const { error } = await supabase.from('reminders').delete().eq('id', id).eq('user_id', userId);
  return { error };
}

export async function getActivities() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    console.error('getActivities auth error:', userError?.message ?? 'No authenticated user');
    return [] as ActivityRow[];
  }

  const { data, error } = await supabase
    .from('pet_activities')
    .select('*')
    .eq('user_id', userId)
    .order('activity_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('getActivities error:', error.message);
    return [] as ActivityRow[];
  }

  return (data ?? []) as ActivityRow[];
}

export async function createActivity(input: Partial<ActivityRow> & Pick<ActivityRow, 'pet_id' | 'activity_type'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return {
      data: null,
      error: userError ?? new Error('No authenticated user available for activity creation.'),
    } as const;
  }

  const payload = {
    user_id: userId,
    pet_id: input.pet_id,
    activity_type: input.activity_type,
    duration_minutes: input.duration_minutes ?? 0,
    notes: input.notes ?? null,
    activity_date: input.activity_date ?? new Date().toISOString(),
  };

  const { data, error } = await supabase.from('pet_activities').insert(payload).select().single();
  return { data: (data ?? null) as ActivityRow | null, error };
}

export async function updateActivity(id: string, values: Partial<ActivityRow>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return {
      data: null,
      error: userError ?? new Error('No authenticated user available for activity update.'),
    } as const;
  }

  const { data, error } = await supabase
    .from('pet_activities')
    .update(values)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  return { data: (data ?? null) as ActivityRow | null, error };
}

export async function deleteActivity(id: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    return { error: userError ?? new Error('No authenticated user available for activity deletion.') };
  }

  const { error } = await supabase.from('pet_activities').delete().eq('id', id).eq('user_id', userId);
  return { error };
}

export async function getPlantFavorites() {
  const { data, error } = await supabase.from('plant_favorites').select('*');

  if (error) {
    console.error('getPlantFavorites error:', error.message);
    return [] as PlantFavoriteRow[];
  }

  return (data ?? []) as PlantFavoriteRow[];
}
