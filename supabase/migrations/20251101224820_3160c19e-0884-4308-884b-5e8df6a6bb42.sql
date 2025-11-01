-- Allow anyone to view loyalty points for anonymous users (loyalty card leads)
CREATE POLICY "Anyone can view loyalty card points"
ON public.loyalty_points
FOR SELECT
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);