-- Comprehensive security fix: Ensure all sensitive tables block anonymous access

-- Fix loyalty_points: Update existing policy to explicitly check auth.uid()
DROP POLICY IF EXISTS "Users can view their own points" ON public.loyalty_points;
CREATE POLICY "Authenticated users can view their own points"
ON public.loyalty_points
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Block anon completely from loyalty_points
REVOKE ALL ON public.loyalty_points FROM anon;

-- Fix membership_passes: Ensure only authenticated users access
DROP POLICY IF EXISTS "Users can view their own passes" ON public.membership_passes;
CREATE POLICY "Authenticated users can view their own passes"
ON public.membership_passes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Block anon completely from membership_passes
REVOKE ALL ON public.membership_passes FROM anon;

-- Fix loyalty_rewards: keep public read but only for active rewards
-- This is intentional - rewards should be visible to encourage signups
-- No change needed here

-- Re-grant SELECT to authenticated for products (public should still see available products)
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.products TO anon;