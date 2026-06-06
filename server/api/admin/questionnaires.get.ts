import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    
    // 1. Fetch all questionnaires
    const { data: questionnaires, error: qError } = await supabaseAdmin
      .from('questionnaires')
      .select('*');
      
    if (qError) {
      console.error('Error fetching questionnaires:', qError.message);
      return { success: false, error: 'Failed to retrieve questionnaires' };
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
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError.message);
      return { success: false, error: 'Failed to retrieve user emails' };
    }

    // Map profiles and emails
    const profilesMap = {};
    (profiles || []).forEach(p => {
      profilesMap[p.id] = `${p.first_name || ''} ${p.last_name || ''}`.trim();
    });

    const emailsMap = {};
    (authData?.users || []).forEach(u => {
      emailsMap[u.id] = u.email;
    });

    // Format responses
    const formattedResponses = (questionnaires || []).map(q => ({
      ...q,
      name: profilesMap[q.user_id] || 'Unknown',
      email: emailsMap[q.user_id] || 'Unknown',
    }));

    return { success: true, data: formattedResponses };
  } catch (err: any) {
    console.error('Exception in admin/questionnaires:', err.message);
    return { success: false, error: `Internal server error: ${err.message}` };
  }
});
