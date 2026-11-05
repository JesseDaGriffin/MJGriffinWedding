-- ====================================================================
-- Data Cleanup & Admin Configuration Script
-- ====================================================================
--
-- Instructions:
-- Copy and run this script in the Supabase SQL Editor.
--
-- Actions performed:
-- 1. Updates `public.is_admin()` to check `app_metadata.is_admin` in the JWT.
-- 2. Creates a reusable `public.set_user_admin(target_email, admin_status)`
--    function to grant/revoke admin access in `auth.users.raw_app_meta_data`
--    (and automatically remove any RSVP data when promoting to admin).
-- 3. Sets `madelinejean2@gmail.com` and `dagriffinwedding@gmail.com` as
--    admins and deletes any RSVP records for them.
-- 4. Deletes duplicate user `bd1b04cb-ffda-412b-ab15-b692b040460d` and
--    all of their associated data across all tables.
-- ====================================================================

BEGIN;

-- 1. Update `public.is_admin()` helper function for RLS policies
--    Reads `app_metadata.is_admin` from the user's Supabase JWT.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Reusable function to set/unset a user as admin by email
CREATE OR REPLACE FUNCTION public.set_user_admin(
  target_email TEXT,
  admin_status BOOLEAN DEFAULT true
)
RETURNS TEXT AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE LOWER(email) = LOWER(TRIM(target_email))
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RETURN 'User with email ' || target_email || ' not found.';
  END IF;

  -- Update raw_app_meta_data on auth.users
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object('is_admin', admin_status)
  WHERE id = target_user_id;

  -- Remove any RSVP data when promoting a user to admin
  IF admin_status THEN
    DELETE FROM public.rsvps
    WHERE user_id = target_user_id;
  END IF;

  RETURN 'Updated admin status for ' || target_email || ' (ID: ' || target_user_id || ') to ' || admin_status || '.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Delete RSVP data for madelinejean2@gmail.com and set both
--    madelinejean2@gmail.com and dagriffinwedding@gmail.com as admins
SELECT public.set_user_admin('madelinejean2@gmail.com', true);
SELECT public.set_user_admin('dagriffinwedding@gmail.com', true);

-- 4. Delete user bd1b04cb-ffda-412b-ab15-b692b040460d and all associated data
DELETE FROM public.profiles
WHERE id = 'bd1b04cb-ffda-412b-ab15-b692b040460d';

DELETE FROM public.rsvps
WHERE user_id = 'bd1b04cb-ffda-412b-ab15-b692b040460d';

DELETE FROM public.questionnaires
WHERE user_id = 'bd1b04cb-ffda-412b-ab15-b692b040460d';

DELETE FROM public.contact_messages
WHERE user_id = 'bd1b04cb-ffda-412b-ab15-b692b040460d';

DELETE FROM auth.users
WHERE id = 'bd1b04cb-ffda-412b-ab15-b692b040460d';

COMMIT;
