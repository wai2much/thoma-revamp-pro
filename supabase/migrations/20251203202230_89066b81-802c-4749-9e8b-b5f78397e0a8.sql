-- Add wallet pass columns to loyalty_members table
ALTER TABLE public.loyalty_members 
ADD COLUMN apple_url text,
ADD COLUMN google_url text,
ADD COLUMN pass_id text;