-- Create table for PassEntry configuration
CREATE TABLE IF NOT EXISTS public.passentry_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  template_id text NOT NULL,
  tier_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.passentry_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read config
CREATE POLICY "Anyone can view passentry config"
ON public.passentry_config
FOR SELECT
TO authenticated
USING (true);

-- Only service role can manage config (for admin operations)
CREATE POLICY "Service role can manage config"
ON public.passentry_config
FOR ALL
USING (true);