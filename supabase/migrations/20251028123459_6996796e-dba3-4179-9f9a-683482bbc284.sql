-- Create membership_passes table to track generated passes
CREATE TABLE IF NOT EXISTS public.membership_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  pass_id TEXT NOT NULL,
  apple_url TEXT,
  google_url TEXT,
  download_url TEXT,
  subscription_id TEXT NOT NULL,
  product_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate passes per subscription
CREATE UNIQUE INDEX IF NOT EXISTS membership_passes_subscription_id_unique 
ON public.membership_passes(subscription_id);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS membership_passes_user_id_idx 
ON public.membership_passes(user_id);

-- Enable RLS
ALTER TABLE public.membership_passes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own passes
CREATE POLICY "Users can view their own passes"
ON public.membership_passes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can insert passes (for webhook)
CREATE POLICY "Service role can insert passes"
ON public.membership_passes
FOR INSERT
TO service_role
WITH CHECK (true);