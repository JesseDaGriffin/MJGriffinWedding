-- ====================================================================
-- Reusable Database Function to Delete User and All Associated Data
-- ====================================================================
--
-- Instructions:
-- 1. Copy and run this script in the Supabase SQL Editor once to define the function.
-- 2. Once created, you can call it anytime to delete a user by email:
--    SELECT public.delete_user_by_email('test@example.com');
--
-- ====================================================================

CREATE OR REPLACE FUNCTION public.delete_user_by_email(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- 1. Locate the user's UUID
    target_user_id := (SELECT id FROM auth.users WHERE email = target_email LIMIT 1);

    -- 2. If the user is found, delete all associated records
    IF target_user_id IS NOT NULL THEN
        -- Delete user profile
        DELETE FROM public.profiles WHERE id = target_user_id;

        -- Delete RSVP record
        DELETE FROM public.rsvps WHERE user_id = target_user_id;

        -- Delete Questionnaire answers
        DELETE FROM public.questionnaires WHERE user_id = target_user_id;

        -- Delete contact messages
        DELETE FROM public.contact_messages WHERE user_id = target_user_id;

        -- Delete from auth.users (cascades to internal auth tables like identities/sessions)
        DELETE FROM auth.users WHERE id = target_user_id;
        
        RETURN 'Successfully deleted user ' || target_email || ' (ID: ' || target_user_id || ') and all associated data.';
    ELSE
        RETURN 'User with email ' || target_email || ' not found.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
