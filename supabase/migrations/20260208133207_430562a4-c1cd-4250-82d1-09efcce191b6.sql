DROP POLICY "Users can view their own loyalty data" ON public.loyalty_members;

CREATE POLICY "Authenticated users can view their own loyalty data"
  ON public.loyalty_members
  FOR SELECT
  TO authenticated
  USING (email = auth.email());