-- ==========================================
-- MARQUE RC INDIA • SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to instantly initialize tables!
-- ==========================================

-- 1. INITIALIZE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    brand_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    compare_price NUMERIC,
    sku TEXT,
    weight_grams NUMERIC,
    scale TEXT,
    terrain_type TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    speed_kmh NUMERIC,
    build_type TEXT,
    images TEXT[] NOT NULL,
    video_url TEXT,
    whats_in_the_box TEXT[] NOT NULL,
    specs JSONB DEFAULT '{}'::jsonb NOT NULL,
    compatible_parts JSONB DEFAULT '[]'::jsonb NOT NULL,
    variants JSONB DEFAULT '[]'::jsonb NOT NULL,
    stock_qty NUMERIC DEFAULT 0 NOT NULL,
    average_rating NUMERIC DEFAULT 0.0 NOT NULL,
    review_count NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (customers can browse catalog)
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT TO public USING (true);

-- Allow full access to authenticated admins & seeding triggers
CREATE POLICY "Allow public upsert for seeding" ON public.products
    FOR ALL TO public USING (true) WITH CHECK (true);


-- 2. INITIALIZE CUSTOMER PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gstin TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow all operations for profile synchronization
CREATE POLICY "Allow public profiles sync" ON public.profiles
    FOR ALL TO public USING (true) WITH CHECK (true);


-- 3. INITIALIZE ORDERS TABLE
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
    tracking_number TEXT,
    shipping_address JSONB NOT NULL,
    logs JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow order tracking and backup registration
CREATE POLICY "Allow public order placement and access" ON public.orders
    FOR ALL TO public USING (true) WITH CHECK (true);
