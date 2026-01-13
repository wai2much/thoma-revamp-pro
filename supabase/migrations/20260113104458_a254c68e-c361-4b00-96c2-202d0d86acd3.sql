-- Fix 1: Ensure RLS is enabled on loyalty_members and policies exist
ALTER TABLE public.loyalty_members ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own loyalty data" ON public.loyalty_members;
DROP POLICY IF EXISTS "Service role full access to loyalty_members" ON public.loyalty_members;

-- Create restrictive policies for loyalty_members
CREATE POLICY "Users can view their own loyalty data"
ON public.loyalty_members
FOR SELECT
TO authenticated
USING (email = auth.email());

CREATE POLICY "Service role full access to loyalty_members"
ON public.loyalty_members
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 2: Revoke public access from loyalty_members
REVOKE ALL ON public.loyalty_members FROM anon;

-- Fix 3: Secure memories table - only service_role should access
DROP POLICY IF EXISTS "Service role can manage memories" ON public.memories;
REVOKE ALL ON public.memories FROM anon;
REVOKE ALL ON public.memories FROM authenticated;

CREATE POLICY "Only service role can access memories"
ON public.memories
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix 4: Secure user_roles table - prevent privilege escalation
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can manage roles (using has_role function)
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Revoke direct access from anon
REVOKE ALL ON public.user_roles FROM anon;

-- Fix 5: Secure the view - revoke public access
REVOKE ALL ON public.user_loyalty_summary FROM anon;