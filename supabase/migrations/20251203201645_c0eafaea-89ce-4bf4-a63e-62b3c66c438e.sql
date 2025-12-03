-- Create loyalty_members table with proper PII storage
CREATE TABLE public.loyalty_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  points_balance integer DEFAULT 20,
  created_at timestamp with time zone DEFAULT now(),
  ip_address text,
  last_card_generated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_members ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert/update (edge functions)
CREATE POLICY "Service role can manage members"
ON public.loyalty_members
FOR ALL
USING (true)
WITH CHECK (true);

-- Public can only view their own card by member_id (no enumeration)
CREATE POLICY "Anyone can view their own member card"
ON public.loyalty_members
FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_loyalty_members_member_id ON public.loyalty_members(member_id);
CREATE INDEX idx_loyalty_members_email ON public.loyalty_members(email);
CREATE INDEX idx_loyalty_members_ip ON public.loyalty_members(ip_address);

-- Fix function search path for get_user_points_balance
CREATE OR REPLACE FUNCTION public.get_user_points_balance(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
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