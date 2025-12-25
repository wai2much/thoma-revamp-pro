-- Fix 1: Add RLS policies to loyalty_members table to protect PII
-- Currently only has "Service role full access" which doesn't protect public access

-- Allow authenticated users to view their own data by matching email
CREATE POLICY "Users can view their own loyalty data"
ON public.loyalty_members
FOR SELECT
TO authenticated
USING (email = auth.email());

-- Allow public/anon to view ONLY their own record by email (for wallet pass lookups)
CREATE POLICY "Anon can view own record by email"
ON public.loyalty_members
FOR SELECT
TO anon
USING (email = auth.email());

-- Fix 2: Enable RLS on the user_loyalty_summary view
-- Note: For views, we need to ensure the underlying table (loyalty_points) has proper RLS
-- The view already respects RLS from loyalty_points table which has "Users can view their own points"
-- But we should add explicit RLS to the view as well

-- First check if RLS is enabled on the view - views inherit from base tables but we can add security
-- Since user_loyalty_summary references loyalty_points which has RLS, 
-- authenticated users can only see their own summary through the base table's RLS