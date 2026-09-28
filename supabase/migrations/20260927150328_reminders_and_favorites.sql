-- ============================================================
-- Reminders
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  notes text,
  type text NOT NULL DEFAULT 'other',
  due_at timestamptz NOT NULL,
  is_repeating boolean NOT NULL DEFAULT false,
  repeat_interval text,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON public.reminders;
CREATE POLICY "select_own_reminders" ON public.reminders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON public.reminders;
CREATE POLICY "insert_own_reminders" ON public.reminders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reminders" ON public.reminders;
CREATE POLICY "update_own_reminders" ON public.reminders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reminders" ON public.reminders;
CREATE POLICY "delete_own_reminders" ON public.reminders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_due_at_idx ON public.reminders(due_at);
CREATE INDEX IF NOT EXISTS reminders_completed_idx ON public.reminders(is_completed);

-- ============================================================
-- Plant favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plant_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, plant_id)
);

ALTER TABLE public.plant_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "select_own_plant_favorites" ON public.plant_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "insert_own_plant_favorites" ON public.plant_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "update_own_plant_favorites" ON public.plant_favorites
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "delete_own_plant_favorites" ON public.plant_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS plant_favorites_user_id_idx ON public.plant_favorites(user_id);
