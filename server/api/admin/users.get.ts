import { defineEventHandler } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    
    // Get all users from auth.users using the admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError.message);
      return { success: false, error: 'Failed to retrieve user list from the database' };
    }

    const emails = authData.users.map(u => u.email).filter(Boolean) as string[];

    return { success: true, emails };
  } catch (err: any) {
    console.error('Exception in get-users:', err.message);
    return { success: false, error: `Internal server error: ${err.message}` };
  }
});
