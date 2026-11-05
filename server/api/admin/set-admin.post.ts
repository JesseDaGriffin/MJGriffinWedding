import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import { isAuthorizedAdmin, setUserAdminByEmail } from '../../utils/email';

export default defineEventHandler(async (event) => {
  try {
    if (!(await isAuthorizedAdmin(event))) {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const body = await readBody(event);
    const email = body?.email;
    const isAdmin = body?.isAdmin !== undefined ? Boolean(body.isAdmin) : true;

    const supabaseAdmin = await serverSupabaseServiceRole(event);
    return await setUserAdminByEmail(supabaseAdmin, email, isAdmin);
  } catch (err: any) {
    console.error('Exception in admin/set-admin:', err.message);
    return { success: false, error: `Failed to update admin status: ${err.message}` };
  }
});
