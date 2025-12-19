-- Fix 1: loyalty_members - restrict to service_role only
DROP POLICY IF EXISTS "Service role can manage members" ON loyalty_members;
DROP POLICY IF EXISTS "Service role can read members" ON loyalty_members;

CREATE POLICY "Service role full access"
ON loyalty_members FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: passentry_config - restrict SELECT to admin only
DROP POLICY IF EXISTS "Authenticated users can view passentry config" ON passentry_config;
DROP POLICY IF EXISTS "Service role can manage config" ON passentry_config;

CREATE POLICY "Admins can view config"
ON passentry_config FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage config"
ON passentry_config FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 3: memories - remove duplicate and restrict to service_role
DROP POLICY IF EXISTS "Service role can manage memories" ON memories;
DROP POLICY IF EXISTS "Service role can read memories" ON memories;

CREATE POLICY "Service role full access"
ON memories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 4: loyalty_rewards - restrict management to service_role
DROP POLICY IF EXISTS "Service role can manage rewards" ON loyalty_rewards;

CREATE POLICY "Service role can manage rewards"
ON loyalty_rewards FOR ALL
TO service_role
USING (true)
WITH CHECK (true);