-- Fix security definer view by enabling security invoker mode
ALTER VIEW public.user_loyalty_summary SET (security_invoker = on);