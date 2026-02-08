-- Rename passentry_config to passkit_config and update columns
-- Add passkit_program_id column
ALTER TABLE public.passentry_config ADD COLUMN IF NOT EXISTS passkit_program_id text;

-- Add passkit_tier_id column (template_id will be kept for backward compat but passkit_tier_id is the new one)
ALTER TABLE public.passentry_config ADD COLUMN IF NOT EXISTS passkit_tier_id text;

-- Set default program ID for all existing rows
UPDATE public.passentry_config SET passkit_program_id = '090GL9tNop4009zPvkhvyV' WHERE passkit_program_id IS NULL;

-- Insert/update config for each product tier with a placeholder tier ID
-- These can be updated later when real tier IDs are known
INSERT INTO public.passentry_config (product_id, tier_name, template_id, passkit_program_id, passkit_tier_id)
VALUES 
  ('prod_TIKlo107LUfRkP', 'Single Pack', '', '090GL9tNop4009zPvkhvyV', 'single'),
  ('prod_TIKmAWTileFjnm', 'Family Pack', '', '090GL9tNop4009zPvkhvyV', 'family'),
  ('prod_TIKmxYafsqTXwO', 'Business Starter Pack', '', '090GL9tNop4009zPvkhvyV', 'business-starter'),
  ('prod_TIKmurHwJ5bDWJ', 'Business Velocity Pack', '', '090GL9tNop4009zPvkhvyV', 'business-velocity')
ON CONFLICT (product_id) DO UPDATE SET
  passkit_program_id = EXCLUDED.passkit_program_id,
  passkit_tier_id = EXCLUDED.passkit_tier_id;