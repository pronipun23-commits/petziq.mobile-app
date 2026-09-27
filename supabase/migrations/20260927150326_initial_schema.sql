CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Petziq User',
  pet_name text NOT NULL DEFAULT 'My Pet',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON public.profiles;
CREATE POLICY "delete_own_profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, pet_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Petziq User'),
    COALESCE(NEW.raw_user_meta_data->>'pet_name', 'My Pet')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

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

-- ============================================================
-- Smart tags
-- ============================================================
CREATE TABLE IF NOT EXISTS public.smart_tag_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  shipping_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  quantity int NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 100),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')
  ),
  payment_ref text,
  shipping_status text NOT NULL DEFAULT 'pending' CHECK (
    shipping_status IN ('pending', 'processing', 'packed', 'shipped', 'in_transit', 'delivered', 'cancelled')
  ),
  courier text,
  tracking_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tag_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON public.smart_tag_orders;
CREATE POLICY "select_own_orders"
  ON public.smart_tag_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON public.smart_tag_orders;
CREATE POLICY "insert_own_orders"
  ON public.smart_tag_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.smart_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (
    status IN ('available', 'reserved', 'sold', 'shipped', 'activated', 'disabled', 'lost', 'retired')
  ),
  pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.smart_tag_orders(id) ON DELETE SET NULL,
  qr_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_smart_tags" ON public.smart_tags;
CREATE POLICY "public_select_smart_tags"
  ON public.smart_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS public.smart_tag_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.smart_tag_orders(id) ON DELETE CASCADE,
  tag_id text NOT NULL REFERENCES public.smart_tags(tag_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tag_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON public.smart_tag_order_items;
CREATE POLICY "select_own_order_items"
  ON public.smart_tag_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.smart_tag_orders
      WHERE public.smart_tag_orders.id = public.smart_tag_order_items.order_id
        AND public.smart_tag_orders.user_id = auth.uid()
    )
  );

CREATE SEQUENCE IF NOT EXISTS public.smart_tag_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.smart_tag_order_num_seq START 1;

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.smart_tag_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON public.smart_tag_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_shipping ON public.smart_tag_orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.smart_tag_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smart_tags_status ON public.smart_tags(status);
CREATE INDEX IF NOT EXISTS idx_smart_tags_owner ON public.smart_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_pet ON public.smart_tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_order ON public.smart_tags(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.smart_tag_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tag ON public.smart_tag_order_items(tag_id);
