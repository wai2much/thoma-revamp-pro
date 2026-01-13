-- Final comprehensive security fix

-- 1. Fix loyalty_points: Add DELETE protection
CREATE POLICY "Service role can delete points"
ON public.loyalty_points
FOR DELETE
TO service_role
USING (true);

-- 2. Fix loyalty_rewards: Add explicit INSERT/UPDATE/DELETE protection for non-admins
DROP POLICY IF EXISTS "Anyone can view active rewards" ON public.loyalty_rewards;

-- Only authenticated users can view active rewards (not anon)
CREATE POLICY "Authenticated users can view active rewards"
ON public.loyalty_rewards
FOR SELECT
TO authenticated
USING (is_active = true);

-- Anon can also view active rewards (for landing page showcase)
CREATE POLICY "Anon can view active rewards"
ON public.loyalty_rewards
FOR SELECT
TO anon
USING (is_active = true);

-- Block INSERT/UPDATE/DELETE from authenticated (service role still has ALL)
REVOKE INSERT, UPDATE, DELETE ON public.loyalty_rewards FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.loyalty_rewards FROM anon;

-- 3. Clean up memories table duplicate policies
DROP POLICY IF EXISTS "Service role full access" ON public.memories;

-- 4. Fix products INSERT policy - add WITH CHECK
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Fix user_roles INSERT policy - add WITH CHECK  
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));