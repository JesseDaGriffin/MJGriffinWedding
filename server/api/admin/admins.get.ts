import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import { isAuthorizedAdmin } from '../../utils/email';
import { isAdminUser } from '../../../utils/admin';

export default defineEventHandler(async (event) => {
  try {
    if (!(await isAuthorizedAdmin(event))) {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const supabaseAdmin = await serverSupabaseServiceRole(event);

    const [
      { data: authData, error: authError },
      { data: profiles },
      { data: rsvps },
    ] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabaseAdmin.from('profiles').select('id, first_name, last_name'),
      supabaseAdmin.from('rsvps').select('user_id, attending'),
    ]);

    if (authError) {
      return { success: false, error: authError.message };
    }

    const profilesMap = new Map<string, string>();
    for (const p of (profiles as any[]) || []) {
      const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim();
      if (fullName) {
        profilesMap.set(p.id, fullName);
      }
    }

    const declinedUserIds = new Set<string>();
    for (const r of (rsvps as any[]) || []) {
      if (r.attending === false) {
        declinedUserIds.add(r.user_id);
      }
    }

    const admins: Array<{ id: string; name: string; email: string }> = [];
    const eligibleUsers: Array<{ id: string; name: string; email: string }> = [];

    for (const u of (authData?.users as any[]) || []) {
      if (!u.email) continue;
      const metaName = `${u.user_metadata?.first_name || ''} ${u.user_metadata?.last_name || ''}`.trim();
      const userEntry = {
        id: u.id,
        name: profilesMap.get(u.id) || metaName || '',
        email: u.email,
      };

      if (isAdminUser(u)) {
        admins.push(userEntry);
      } else if (!declinedUserIds.has(u.id)) {
        eligibleUsers.push(userEntry);
      }
    }

    admins.sort((a, b) => a.email.localeCompare(b.email));
    eligibleUsers.sort((a, b) =>
      (a.name || a.email).localeCompare(b.name || b.email)
    );

    return {
      success: true,
      admins,
      eligibleUsers,
    };
  } catch (err: any) {
    console.error('Exception in admin/admins:', err.message);
    return { success: false, error: `Failed to retrieve admins: ${err.message}` };
  }
});
