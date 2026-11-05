import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import { getAnnouncementRecipients, isAuthorizedAdmin } from '../../utils/email';

export default defineEventHandler(async (event) => {
  try {
    if (!(await isAuthorizedAdmin(event))) {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const supabaseAdmin = await serverSupabaseServiceRole(event);
    const {
      emails,
      attendingEmails,
      notRsvpdEmails,
      optedOutCount,
      declinedCount,
      totalUsers,
    } = await getAnnouncementRecipients(supabaseAdmin);

    return {
      success: true,
      emails,
      attendingEmails,
      notRsvpdEmails,
      optedOutCount,
      declinedCount,
      totalUsers,
    };
  } catch (err: any) {
    console.error('Exception in get-users:', err.message);
    return { success: false, error: `Failed to retrieve user list: ${err.message}` };
  }
});
