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
  notes?: string | null;
  created_at?: string;
};

export type ProfileRow = {
  id: string;
  full_name: string;
  pet_name: string;
  created_at?: string;
};

export type PlantFavoriteRow = {
  id: string;
  plant_id: string;
  user_id: string;
  created_at?: string;
};

export type UserPlantRow = {
  id: string;
  user_id: string;
  name: string;
  species?: string | null;
  care_level?: string | null;
  watering_frequency?: string | null;
  location?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SmartTagRow = {
  id: string;
  tag_id: string;
  name: string | null;
  tag_type: string;
  status: string;
  pet_id: string | null;
  plant_id: string | null;
  tag_details: Record<string, unknown>;
  visibility: Record<string, boolean>;
  owner_info: Record<string, string>;
  photo_url: string | null;
  activated_at?: string | null;
  created_at: string;
};

export type CareChecklistRow = {
  id: string;
  user_id: string;
  pet_id: string | null;
  task_type: string;
  task_label: string;
  completed_date: string;
  is_completed: boolean;
  completed_at: string | null;
};

async function getAuthenticatedUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Sign in to access your Petziq data.');
  return data.user.id;
}

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

export async function signUpWithEmail(email: string, password: string, fullName: string, petName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        pet_name: petName,
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

export async function getProfile() {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, pet_name, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as ProfileRow | null;
}

export async function getPets() {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as PetRow[];
}

export async function createPet(input: Omit<PetRow, 'id' | 'created_at'>) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('pets')
    .insert({ ...input, user_id: userId })
    .select('*')
    .single();

  return { data: (data ?? null) as PetRow | null, error };
}

export async function getPet(id: string) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as PetRow | null;
}

export async function getReminders() {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('due_at', { ascending: true, nullsFirst: false });

  if (error) throw error;

  return (data ?? []) as ReminderRow[];
}

export async function createReminder(input: Partial<ReminderRow> & Pick<ReminderRow, 'title' | 'due_at'>) {
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
    due_at: input.due_at,
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
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from('pet_activities')
    .select('*')
    .eq('user_id', userId)
    .order('activity_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

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
    duration_minutes: input.duration_minutes ?? null,
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
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('plant_favorites')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return (data ?? []) as PlantFavoriteRow[];
}

export async function getUserPlants() {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('user_plants')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as UserPlantRow[];
}

export async function getSmartTags() {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('smart_tags')
    .select('*')
    .or(`user_id.eq.${userId},owner_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as SmartTagRow[];
}

export async function getSmartTagByTagId(tagId: string) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('smart_tags')
    .select('*')
    .eq('tag_id', tagId)
    .or(`user_id.eq.${userId},owner_id.eq.${userId}`)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as SmartTagRow | null;
}

export async function activateSmartTag(tag: SmartTagRow, linkedEntityId: string) {
  const userId = await getAuthenticatedUserId();
  const link = tag.tag_type === 'plant'
    ? { pet_id: null, plant_id: linkedEntityId }
    : { pet_id: linkedEntityId, plant_id: null };
  const { data, error } = await supabase
    .from('smart_tags')
    .update({ ...link, status: 'active', activated_at: new Date().toISOString() })
    .eq('id', tag.id)
    .or(`user_id.eq.${userId},owner_id.eq.${userId}`)
    .select('*')
    .single();

  return { data: (data ?? null) as SmartTagRow | null, error };
}

export async function getPublicTagInfo(tagId: string) {
  const { data, error } = await supabase.rpc('get_public_tag_info', { p_tag_id: tagId });
  if (error) throw error;
  return data as Record<string, unknown>;
}

export async function getDailyCareChecklist(date = new Date().toISOString().slice(0, 10)) {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('care_checklists')
    .select('*')
    .eq('user_id', userId)
    .eq('completed_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as CareChecklistRow[];
}

export async function saveCareChecklistItem(input: Pick<CareChecklistRow, 'pet_id' | 'task_type' | 'task_label' | 'is_completed'>) {
  const userId = await getAuthenticatedUserId();
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing, error: lookupError } = await supabase
    .from('care_checklists')
    .select('id')
    .eq('user_id', userId)
    .eq('pet_id', input.pet_id)
    .eq('task_type', input.task_type)
    .eq('completed_date', today)
    .maybeSingle();

  if (lookupError) return { data: null, error: lookupError };

  const values = {
    ...input,
    user_id: userId,
    completed_date: today,
    completed_at: input.is_completed ? new Date().toISOString() : null,
  };
  const query = existing
    ? supabase.from('care_checklists').update(values).eq('id', existing.id)
    : supabase.from('care_checklists').insert(values);
  const { data, error } = await query.select('*').single();

  return { data: (data ?? null) as CareChecklistRow | null, error };
}

export async function askPetziqAI(messages: { role: 'user' | 'assistant'; content: string }[], petContext: PetRow[], plantContext: UserPlantRow[]) {
  const { data, error } = await supabase.functions.invoke('petziq-ai', {
    body: {
      messages,
      petContext,
      plantContext,
    },
  });

  if (error) throw error;
  if (typeof data?.reply !== 'string') throw new Error('Petziq AI returned an invalid response.');
  return data.reply as string;
}
