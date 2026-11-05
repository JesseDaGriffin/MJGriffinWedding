import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';
import { isAuthorizedAdmin } from '../../utils/email';

export default defineEventHandler(async (event) => {
  try {
    if (!(await isAuthorizedAdmin(event))) {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    
    // 1. Fetch all RSVPs
    const { data: rsvps, error: rsvpError } = await supabaseAdmin
      .from('rsvps')
      .select('*');
      
    if (rsvpError) {
      console.error('Error fetching RSVPs:', rsvpError.message);
      return { success: false, error: 'Failed to retrieve RSVPs' };
    }

    // 2. Fetch all Profiles for names
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name');

    if (profileError) {
      console.error('Error fetching profiles:', profileError.message);
      return { success: false, error: 'Failed to retrieve profiles' };
    }

    // 3. Fetch all Users for emails
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    
    if (authError) {
      console.error('Error fetching users:', authError.message);
      return { success: false, error: 'Failed to retrieve user emails' };
    }

    // Map profiles and emails
    const profilesMap: Record<string, string> = {};
    ((profiles as any[]) || []).forEach(p => {
      const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim();
      if (fullName) {
        profilesMap[p.id] = fullName;
      }
    });

    const emailsMap: Record<string, string | undefined> = {};
    (authData?.users || []).forEach(u => {
      emailsMap[u.id] = u.email;
      if (!profilesMap[u.id]) {
        const metaName = `${u.user_metadata?.first_name || ''} ${u.user_metadata?.last_name || ''}`.trim();
        if (metaName) {
          profilesMap[u.id] = metaName;
        }
      }
    });

    // Format RSVP responses
    const rsvpList = (rsvps as any[]) || [];
    const rsvpUserIds = new Set(rsvpList.map(r => r.user_id));

    const formattedResponses = rsvpList.map(r => ({
      ...r,
      name: profilesMap[r.user_id] || emailsMap[r.user_id] || 'Unknown',
      email: emailsMap[r.user_id] || 'Unknown',
    }));

    // Build list of users who created an account but have not RSVP'd
    const seenUserIds = new Set<string>();
    const nonRsvpUsers: Array<{ id: string; name: string; email: string }> = [];

    (authData?.users || []).forEach(u => {
      seenUserIds.add(u.id);
      if (!rsvpUserIds.has(u.id)) {
        nonRsvpUsers.push({
          id: u.id,
          name: profilesMap[u.id] || u.email || 'Unknown',
          email: u.email || 'Unknown',
        });
      }
    });

    ((profiles as any[]) || []).forEach(p => {
      if (!seenUserIds.has(p.id) && !rsvpUserIds.has(p.id)) {
        nonRsvpUsers.push({
          id: p.id,
          name: profilesMap[p.id] || emailsMap[p.id] || 'Unknown',
          email: emailsMap[p.id] || 'Unknown',
        });
      }
    });

    return {
      success: true,
      data: formattedResponses,
      nonRsvpUsers,
    };
  } catch (err: any) {
    console.error('Exception in admin/responses:', err.message);
    return { success: false, error: `Internal server error: ${err.message}` };
  }
});
