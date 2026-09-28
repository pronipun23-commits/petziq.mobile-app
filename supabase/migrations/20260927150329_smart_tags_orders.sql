-- ============================================================
-- Smart tag orders
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

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.smart_tag_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON public.smart_tag_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_shipping ON public.smart_tag_orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.smart_tag_orders(created_at DESC);

-- ============================================================
-- Smart tags
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_smart_tags_status ON public.smart_tags(status);
CREATE INDEX IF NOT EXISTS idx_smart_tags_owner ON public.smart_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_pet ON public.smart_tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_order ON public.smart_tags(order_id);

-- ============================================================
-- Smart tag order items
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.smart_tag_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tag ON public.smart_tag_order_items(tag_id);

-- ============================================================
-- Sequences for generated tag IDs and order numbers
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.smart_tag_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.smart_tag_order_num_seq START 1;
