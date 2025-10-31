-- Create loyalty points tracking table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'bonus', 'adjustment')),
  description TEXT NOT NULL,
  order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loyalty rewards catalog
CREATE TABLE IF NOT EXISTS public.loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_value DECIMAL(10,2) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'service', 'product')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_points
CREATE POLICY "Users can view their own points"
  ON public.loyalty_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert points"
  ON public.loyalty_points FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update points"
  ON public.loyalty_points FOR UPDATE
  USING (true);

-- RLS Policies for loyalty_rewards
CREATE POLICY "Anyone can view active rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage rewards"
  ON public.loyalty_rewards FOR ALL
  USING (true);

-- Create view for user points summary
CREATE OR REPLACE VIEW public.user_loyalty_summary AS
SELECT 
  user_id,
  COALESCE(SUM(CASE WHEN transaction_type IN ('earn', 'bonus') THEN points ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN transaction_type IN ('redeem', 'adjustment') AND points > 0 THEN points ELSE 0 END), 0) as total_points,
  COUNT(CASE WHEN transaction_type = 'earn' THEN 1 END) as total_transactions,
  MAX(created_at) as last_activity
FROM public.loyalty_points
GROUP BY user_id;

-- Function to get user points balance
CREATE OR REPLACE FUNCTION public.get_user_points_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Insert default rewards
INSERT INTO public.loyalty_rewards (title, description, points_required, reward_value, reward_type) VALUES
  ('$10 Service Discount', 'Get $10 off your next service', 100, 10.00, 'discount'),
  ('$25 Service Discount', 'Get $25 off your next service', 250, 25.00, 'discount'),
  ('$50 Service Discount', 'Get $50 off your next service', 500, 50.00, 'discount'),
  ('$100 Service Discount', 'Get $100 off your next service', 1000, 100.00, 'discount'),
  ('Free Oil Change', 'Complimentary oil change service', 400, 60.00, 'service'),
  ('Free Tire Rotation', 'Complimentary tire rotation', 200, 30.00, 'service');