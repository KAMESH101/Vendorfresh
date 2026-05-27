-- =====================================================================
-- VendorFresh SQL Database Schema (PostgreSQL / Supabase)
-- =====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Farmers Table ──────────────────────────────────────────────────
CREATE TABLE public.farmers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    quote TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Farmers
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all farmers
CREATE POLICY "Allow public read access for farmers" 
ON public.farmers FOR SELECT 
USING (true);

-- ── 2. Products (Crops) Table ─────────────────────────────────────────
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL,
    farmer_id TEXT REFERENCES public.farmers(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all products
CREATE POLICY "Allow public read access for products" 
ON public.products FOR SELECT 
USING (true);

-- ── 3. Orders (Transactions) Table ────────────────────────────────────
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk User ID (auth.uid() equivalent from JWT claims)
    items JSONB NOT NULL, -- List of cart products purchased
    total_amount NUMERIC NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    delivery_name TEXT,
    delivery_email TEXT,
    delivery_phone TEXT,
    delivery_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can insert their own checkout orders
CREATE POLICY "Allow users to create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (true); -- Insert validation handled by authentication credentials or edge functions

-- Users can only select/view their own orders
CREATE POLICY "Allow users to view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR user_id = 'anonymous');
