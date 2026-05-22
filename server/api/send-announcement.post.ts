import { defineEventHandler, readBody } from 'h3';
import { sendEmail, getAnnouncementEmailTemplate } from '../utils/email';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { subject, message } = body;

  if (!subject || !message) {
    return { success: false, error: 'Subject and message are required' };
  }

  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    
    // Get all users from auth.users using the admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError.message);
      return { success: false, error: 'Failed to retrieve user list from the database' };
    }

    const emails = authData.users.map(u => u.email).filter(Boolean) as string[];

    if (emails.length === 0) {
      return { success: false, error: 'No users found to send email to.' };
    }

    const html = getAnnouncementEmailTemplate(message);

    // Using BCC to protect privacy and send the mass email efficiently
    const result = await sendEmail({
      bcc: emails,
      subject,
      html,
    });

    if (result) {
      return { success: true, message: 'Announcement sent successfully' };
    } else {
      return { success: false, error: 'Failed to send announcement' };
    }
  } catch (err: any) {
    console.error('Exception in send-announcement:', err.message);
    return { success: false, error: 'Internal server error occurred' };
  }
});
