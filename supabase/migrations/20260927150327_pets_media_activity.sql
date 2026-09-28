-- ============================================================
-- Pets
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age text,
  birth_date date,
  photo_url text,
  health_status text NOT NULL DEFAULT 'good',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pets" ON public.pets;
CREATE POLICY "select_own_pets" ON public.pets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pets" ON public.pets;
CREATE POLICY "insert_own_pets" ON public.pets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pets" ON public.pets;
CREATE POLICY "update_own_pets" ON public.pets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pets" ON public.pets;
CREATE POLICY "delete_own_pets" ON public.pets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);

-- ============================================================
-- Pet photos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pet_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pet_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pet_photos" ON public.pet_photos;
CREATE POLICY "select_own_pet_photos" ON public.pet_photos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pet_photos" ON public.pet_photos;
CREATE POLICY "insert_own_pet_photos" ON public.pet_photos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pet_photos" ON public.pet_photos;
CREATE POLICY "update_own_pet_photos" ON public.pet_photos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pet_photos" ON public.pet_photos;
CREATE POLICY "delete_own_pet_photos" ON public.pet_photos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_id ON public.pet_photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_user_id ON public.pet_photos(user_id);

-- ============================================================
-- Pet activities
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pet_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  duration_minutes integer,
  notes text,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pet_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pet_activities" ON public.pet_activities;
CREATE POLICY "select_own_pet_activities" ON public.pet_activities FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pet_activities" ON public.pet_activities;
CREATE POLICY "insert_own_pet_activities" ON public.pet_activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pet_activities" ON public.pet_activities;
CREATE POLICY "update_own_pet_activities" ON public.pet_activities FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pet_activities" ON public.pet_activities;
CREATE POLICY "delete_own_pet_activities" ON public.pet_activities FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pet_activities_pet_id ON public.pet_activities(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_activities_user_date ON public.pet_activities(user_id, activity_date DESC);

-- ============================================================
-- Daily care checklists
-- ============================================================
CREATE TABLE IF NOT EXISTS public.care_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  task_label text NOT NULL DEFAULT '',
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, pet_id, task_type, completed_date)
);

ALTER TABLE public.care_checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checklists" ON public.care_checklists;
CREATE POLICY "select_own_checklists" ON public.care_checklists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checklists" ON public.care_checklists;
CREATE POLICY "insert_own_checklists" ON public.care_checklists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checklists" ON public.care_checklists;
CREATE POLICY "update_own_checklists" ON public.care_checklists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checklists" ON public.care_checklists;
CREATE POLICY "delete_own_checklists" ON public.care_checklists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_checklists_user_date ON public.care_checklists(user_id, completed_date DESC);
