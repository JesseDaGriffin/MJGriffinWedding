import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = body?.email?.trim()?.toLowerCase();
  const subscribe = Boolean(body?.subscribe);

  if (!email) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error('Error fetching users for unsubscribe:', authError.message);
      return { success: false, error: 'Unable to process your request at this time.' };
    }

    const targetUser = authData.users.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (!targetUser) {
      return {
        success: false,
        error: 'No registered guest account was found with that email address.',
      };
    }

    // Update auth.users user_metadata
    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      {
        user_metadata: {
          ...(targetUser.user_metadata || {}),
          receive_announcements: subscribe,
        },
      }
    );

    if (updateAuthError) {
      console.error('Error updating user metadata:', updateAuthError.message);
      return { success: false, error: 'Failed to update email preferences.' };
    }

    // Also update profiles table if receive_announcements column exists
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: targetUser.id,
        first_name: targetUser.user_metadata?.first_name || '',
        last_name: targetUser.user_metadata?.last_name || '',
        receive_announcements: subscribe,
      });

    if (profileError && !profileError.message?.includes('receive_announcements')) {
      console.warn('Non-fatal error updating profile email preference:', profileError.message);
    }

    return {
      success: true,
      receiveAnnouncements: subscribe,
      message: subscribe
        ? 'You have been re-subscribed to wedding announcement emails.'
        : 'You have been unsubscribed from wedding announcement emails.',
    };
  } catch (err: any) {
    console.error('Exception in unsubscribe endpoint:', err.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
});
