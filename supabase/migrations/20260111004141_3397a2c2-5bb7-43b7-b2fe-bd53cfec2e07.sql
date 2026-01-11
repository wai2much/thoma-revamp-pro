-- Fix 1: Add authorization check to get_user_points_balance function
-- This prevents any authenticated user from querying another user's points balance
CREATE OR REPLACE FUNCTION public.get_user_points_balance(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  -- Verify caller owns this user_id (prevents unauthorized access)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Not authenticated';
  END IF;
  
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot access other users points';
  END IF;
  
  SELECT COALESCE(
    SUM(CASE WHEN transaction_type IN ('earn', 'bonus') THEN points ELSE 0 END) -
    SUM(CASE WHEN transaction_type IN ('redeem', 'adjustment') AND points > 0 THEN points ELSE 0 END),
    0
  )
  INTO v_balance
  FROM public.loyalty_points
  WHERE user_id = p_user_id;
  
  RETURN v_balance;
END;
$$;

-- Fix 2: Drop existing policies and recreate with proper security for loyalty_members
-- First ensure RLS is enabled
ALTER TABLE public.loyalty_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anon can view own record by email" ON public.loyalty_members;
DROP POLICY IF EXISTS "Service role full access" ON public.loyalty_members;
DROP POLICY IF EXISTS "Users can view their own loyalty data" ON public.loyalty_members;

-- Create new secure policies - authenticated users only can view their own data
CREATE POLICY "Authenticated users can view their own loyalty data"
ON public.loyalty_members
FOR SELECT
TO authenticated
USING (email = auth.email());

-- Service role for backend operations (edge functions)
CREATE POLICY "Service role can manage loyalty members"
ON public.loyalty_members
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 3: Add RLS to user_loyalty_summary view
-- Note: Views inherit RLS from underlying tables, but we can add explicit security
-- The view queries loyalty_points which has RLS, so it should be protected
-- However, let's ensure the view itself is secure by creating a policy

-- For views, we need to use security_invoker or create RLS on the view itself
-- Since this is a view, we'll drop and recreate it with security_invoker
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

-- Grant select on the view to authenticated users
GRANT SELECT ON public.user_loyalty_summary TO authenticated;