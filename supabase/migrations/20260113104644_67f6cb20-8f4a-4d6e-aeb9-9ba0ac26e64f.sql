-- Fix 1: Strengthen user_roles policies - split ALL into specific operations
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Admins can INSERT new roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can UPDATE existing roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can DELETE roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Strengthen products policies - split ALL into specific operations
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Admins can INSERT products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can UPDATE products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can DELETE products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Revoke any public access from products for non-SELECT operations
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM authenticated;