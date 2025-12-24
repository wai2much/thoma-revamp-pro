-- Fix 1: loyalty_points - INSERT/UPDATE should be service_role only, not public
DROP POLICY IF EXISTS "Service role can insert points" ON loyalty_points;
DROP POLICY IF EXISTS "Service role can update points" ON loyalty_points;

CREATE POLICY "Service role can insert points"
ON loyalty_points FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update points"
ON loyalty_points FOR UPDATE
TO service_role
USING (true);

-- Fix 2: membership_passes - Add UPDATE/DELETE policies for service_role only
CREATE POLICY "Service role can update passes"
ON membership_passes FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Service role can delete passes"
ON membership_passes FOR DELETE
TO service_role
USING (true);

-- Fix 3: slack_events - Add INSERT/UPDATE/DELETE policies for service_role only
CREATE POLICY "Service role can insert events"
ON slack_events FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update events"
ON slack_events FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Service role can delete events"
ON slack_events FOR DELETE
TO service_role
USING (true);