-- Fix 1: Drop and recreate loyalty_members policies as PERMISSIVE (not restrictive)
DROP POLICY IF EXISTS "Authenticated users can view their own loyalty data" ON public.loyalty_members;
DROP POLICY IF EXISTS "Service role can manage loyalty members" ON public.loyalty_members;

-- Create proper permissive policies for loyalty_members
CREATE POLICY "Users can view their own loyalty data"
ON public.loyalty_members
FOR SELECT
TO authenticated
USING (email = auth.email());

CREATE POLICY "Service role full access to loyalty_members"
ON public.loyalty_members
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: Recreate user_loyalty_summary view with security_invoker for RLS inheritance
DROP VIEW IF EXISTS public.user_loyalty_summary;

CREATE VIEW public.user_loyalty_summary
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  SUM(CASE WHEN transaction_type IN ('earn', 'bonus') THEN points ELSE -points END) as total_points,
  COUNT(*) as total_transactions,
  MAX(created_at) as last_activity
FROM public.loyalty_points
GROUP BY user_id;

-- Grant access to authenticated users
GRANT SELECT ON public.user_loyalty_summary TO authenticated;