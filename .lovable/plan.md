

# Fix: Restrict loyalty_members RLS to authenticated users only

## Problem

The `loyalty_members` table has RLS enabled with two policies:
- **"Service role full access"** - grants full CRUD to the service role (correct)
- **"Users can view their own loyalty data"** - uses `email = auth.email()` but targets ALL roles, including `anon`

While the `anon` role would get `null` from `auth.email()` (so no rows would match), best practice is to explicitly restrict SELECT to the `authenticated` role only. This adds defense-in-depth and makes the security intent clear.

## Changes

**Single database migration** that:

1. Drops the existing "Users can view their own loyalty data" policy
2. Re-creates it targeting only the `authenticated` role explicitly

```sql
DROP POLICY "Users can view their own loyalty data" ON public.loyalty_members;

CREATE POLICY "Authenticated users can view their own loyalty data"
  ON public.loyalty_members
  FOR SELECT
  TO authenticated
  USING (email = auth.email());
```

No code changes needed -- the edge functions already use service role keys, and the client-side code properly uses edge functions for anonymous access patterns (e.g., `get-loyalty-pass`).

