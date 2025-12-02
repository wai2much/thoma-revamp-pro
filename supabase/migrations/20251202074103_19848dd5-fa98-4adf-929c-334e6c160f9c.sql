-- Fix Critical Security Issues

-- 1. Remove public access to loyalty_points table (CRITICAL - exposes customer PII)
DROP POLICY IF EXISTS "Anyone can view loyalty card points" ON loyalty_points;

-- 2. Add proper read policy for memories table (only service role should access)
CREATE POLICY "Service role can read memories"
ON memories
FOR SELECT
TO service_role
USING (true);

-- 3. Remove public access to passentry_config (exposes business configuration)
DROP POLICY IF EXISTS "Anyone can view passentry config" ON passentry_config;

-- 4. Allow authenticated users to view passentry config
CREATE POLICY "Authenticated users can view passentry config"
ON passentry_config
FOR SELECT
TO authenticated
USING (true);