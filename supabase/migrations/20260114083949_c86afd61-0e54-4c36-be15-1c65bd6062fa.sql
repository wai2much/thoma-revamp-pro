-- Create a secure function for operators to lookup member data by member_id
-- This allows operators to scan QR codes and retrieve actual member information
CREATE OR REPLACE FUNCTION public.get_member_by_member_id(p_member_id text)
RETURNS TABLE (
  user_id uuid,
  member_name text,
  member_email text,
  member_phone text,
  points_balance integer,
  member_since timestamptz,
  pass_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only operators and admins can look up member data
  IF NOT (has_role(auth.uid(), 'operator') OR has_role(auth.uid(), 'admin')) THEN
    RAISE EXCEPTION 'Unauthorized: Only operators and admins can scan members';
  END IF;

  -- Return member data from loyalty_members table
  -- Also join with membership_passes for subscription info
  RETURN QUERY
  SELECT 
    mp.user_id,
    lm.name as member_name,
    lm.email as member_email,
    lm.phone as member_phone,
    COALESCE(lm.points_balance, 0) as points_balance,
    lm.created_at as member_since,
    mp.product_id as pass_id
  FROM loyalty_members lm
  LEFT JOIN membership_passes mp ON lm.member_id = mp.member_id
  WHERE lm.member_id = p_member_id
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users (RLS in function handles authorization)
GRANT EXECUTE ON FUNCTION public.get_member_by_member_id(text) TO authenticated;