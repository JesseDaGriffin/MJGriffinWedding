import { defineEventHandler, readBody, getRequestURL } from 'h3';
import { sendEmail, getAnnouncementEmailTemplate, getAnnouncementRecipients } from '../utils/email';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { subject, message } = body;

  if (!subject || !message) {
    return { success: false, error: 'Subject and message are required' };
  }

  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    const { emails } = await getAnnouncementRecipients(supabaseAdmin);

    if (emails.length === 0) {
      return { success: false, error: 'No subscribed users found to send email to.' };
    }

    const requestUrl = getRequestURL(event);
    const siteUrl = requestUrl?.origin || 'https://mjgriffinwedding.netlify.app';
    const html = getAnnouncementEmailTemplate(message, siteUrl);

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
