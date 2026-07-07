-- ==========================================
-- MARQUE RC INDIA • SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to instantly initialize tables!
-- ==========================================

-- 1. INITIALIZE CUSTOMER PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid not null default gen_random_uuid (),
  name text not null,
  phone text not null,
  address_line text null,
  city text null,
  state text null,
  pincode text null,
  gstin text null,
  is_admin boolean null default false,
  wishlist jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint profiles_pkey primary key (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow insert during signup
DROP POLICY IF EXISTS "Allow public profiles sync" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile insert" ON public.profiles;
CREATE POLICY "Allow profile insert" ON public.profiles FOR INSERT TO public WITH CHECK (true);

-- Allow users to read and update their own profile
DROP POLICY IF EXISTS "Allow user read own profile" ON public.profiles;
CREATE POLICY "Allow user read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
DROP POLICY IF EXISTS "Allow user update own profile" ON public.profiles;
CREATE POLICY "Allow user update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());


-- 2. INITIALIZE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id text not null,
  name text null,
  slug text null,
  description text null,
  price numeric null,
  compare_price numeric null,
  shipping_price numeric null default 0,
  battery_addon_price numeric null default 0,
  sku text null,
  weight_grams numeric null,
  scale text null,
  terrain_type text null,
  is_featured boolean null default false,
  is_active boolean null default true,
  speed_kmh numeric null,
  build_type text null,
  images jsonb null default '[]'::jsonb,
  video_url text null,
  whats_in_the_box jsonb null default '[]'::jsonb,
  specs jsonb null default '{}'::jsonb,
  compatible_parts jsonb null default '[]'::jsonb,
  variants jsonb null default '[]'::jsonb,
  stock_qty numeric null default 0,
  average_rating numeric null default 0,
  review_count numeric null default 0,
  brand_id text null,
  category_id text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint products_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (customers can browse catalog)
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT TO public USING (true);

-- Allow full access to authenticated admins only (insert, update, delete)
DROP POLICY IF EXISTS "Allow public upsert for seeding" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert products" ON public.products;
CREATE POLICY "Allow admin insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin update products" ON public.products;
CREATE POLICY "Allow admin update products" ON public.products
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin delete products" ON public.products;
CREATE POLICY "Allow admin delete products" ON public.products
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );


-- 3. INITIALIZE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access (customers can browse categories)
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories
    FOR SELECT TO public USING (true);

-- Allow full access for admin only
DROP POLICY IF EXISTS "Allow public upsert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin insert categories" ON public.categories;
CREATE POLICY "Allow admin insert categories" ON public.categories
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin update categories" ON public.categories;
CREATE POLICY "Allow admin update categories" ON public.categories
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin delete categories" ON public.categories;
CREATE POLICY "Allow admin delete categories" ON public.categories
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );


-- 4. INITIALIZE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    gst_amount NUMERIC NOT NULL,
    shipping_amount NUMERIC NOT NULL,
    discount_amount NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_id TEXT,
    advance_paid_amount NUMERIC,
    tracking_number TEXT,
    shipping_address JSONB NOT NULL,
    logs JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public order placement (guest checkout)
DROP POLICY IF EXISTS "Allow public order placement and access" ON public.orders;
DROP POLICY IF EXISTS "Allow public order insert" ON public.orders;
CREATE POLICY "Allow public order insert" ON public.orders FOR INSERT TO public WITH CHECK (true);

-- Restrict read/update access strictly to Admin users
DROP POLICY IF EXISTS "Allow admin read orders" ON public.orders;
CREATE POLICY "Allow admin read orders" ON public.orders FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "Allow admin update orders" ON public.orders;
CREATE POLICY "Allow admin update orders" ON public.orders FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 5. INITIALIZE GUIDES TABLE
CREATE TABLE IF NOT EXISTS public.guides (
  id text not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  read_time text not null,
  image_url text not null,
  date text not null,
  created_at timestamp with time zone not null default now(),
  constraint guides_pkey primary key (id)
);

-- Enable RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (customers can read guides)
DROP POLICY IF EXISTS "Allow public read guides" ON public.guides;
CREATE POLICY "Allow public read guides" ON public.guides
    FOR SELECT TO public USING (true);

-- Allow full access to authenticated admins only
DROP POLICY IF EXISTS "Allow admin insert guides" ON public.guides;
CREATE POLICY "Allow admin insert guides" ON public.guides
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin update guides" ON public.guides;
CREATE POLICY "Allow admin update guides" ON public.guides
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin delete guides" ON public.guides;
CREATE POLICY "Allow admin delete guides" ON public.guides
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );


-- 6. INITIALIZE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id text not null,
  product_id text not null,
  reviewer_name text not null,
  rating integer not null,
  title text not null,
  body text not null,
  date text not null,
  is_verified boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint reviews_pkey primary key (id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and insert
DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK (true);

-- Allow full access to authenticated admins only
DROP POLICY IF EXISTS "Allow admin update reviews" ON public.reviews;
CREATE POLICY "Allow admin update reviews" ON public.reviews
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin delete reviews" ON public.reviews;
CREATE POLICY "Allow admin delete reviews" ON public.reviews
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );


-- 7. INITIALIZE SITE_CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.site_config (
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone not null default now(),
  constraint site_config_pkey primary key (key)
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
DROP POLICY IF EXISTS "Allow public read site_config" ON public.site_config;
CREATE POLICY "Allow public read site_config" ON public.site_config FOR SELECT TO public USING (true);

-- Allow full access to authenticated admins only
DROP POLICY IF EXISTS "Allow admin insert site_config" ON public.site_config;
CREATE POLICY "Allow admin insert site_config" ON public.site_config
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin update site_config" ON public.site_config;
CREATE POLICY "Allow admin update site_config" ON public.site_config
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
DROP POLICY IF EXISTS "Allow admin delete site_config" ON public.site_config;
CREATE POLICY "Allow admin delete site_config" ON public.site_config
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
