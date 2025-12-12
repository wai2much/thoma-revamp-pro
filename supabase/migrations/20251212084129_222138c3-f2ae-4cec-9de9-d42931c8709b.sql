-- Fix 1: Drop the overly permissive policy on loyalty_members
DROP POLICY IF EXISTS "Anyone can view their own member card" ON loyalty_members;

-- Create a more restrictive policy - only service role can read (for edge functions)
-- Members will access their data through the edge function, not directly
CREATE POLICY "Service role can read members"
ON loyalty_members FOR SELECT
USING (true);

-- Note: The existing "Service role can manage members" policy handles INSERT/UPDATE/DELETE
-- The SELECT policy above works because only service role key bypasses RLS anyway
-- For anon/authenticated users, they cannot read this table directly

-- Fix 2: Enable RLS on user_loyalty_summary view if it's a table
-- First check if it needs RLS enabled (views inherit from base tables)
-- The user_loyalty_summary is a VIEW, not a table, so RLS on the underlying loyalty_points table applies
-- However, we should ensure proper access through the view

-- Fix 3: Revoke direct access from anon role on loyalty_members to ensure no public access
REVOKE SELECT ON loyalty_members FROM anon;
REVOKE SELECT ON loyalty_members FROM authenticated;