import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import { getAnnouncementRecipients } from '../../utils/email';

export default defineEventHandler(async (event) => {
  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    const { emails, optedOutCount, totalUsers } = await getAnnouncementRecipients(supabaseAdmin);

    return { success: true, emails, optedOutCount, totalUsers };
  } catch (err: any) {
    console.error('Exception in get-users:', err.message);
    return { success: false, error: `Failed to retrieve user list: ${err.message}` };
  }
});
