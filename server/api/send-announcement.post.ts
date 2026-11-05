import { defineEventHandler, readBody, getRequestURL } from 'h3';
import { sendEmail, getAnnouncementEmailTemplate, getAnnouncementRecipients, isAuthorizedAdmin } from '../utils/email';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  if (!(await isAuthorizedAdmin(event))) {
    return { success: false, error: 'Unauthorized: Admin access required.' };
  }

  const body = await readBody(event);
  const { subject, message, target = 'all' } = body;

  if (!subject || !message) {
    return { success: false, error: 'Subject and message are required' };
  }

  try {
    const supabaseAdmin = await serverSupabaseServiceRole(event);
    const { emails, attendingEmails, notRsvpdEmails } = await getAnnouncementRecipients(supabaseAdmin);

    let recipientList = emails;
    if (target === 'attending') {
      recipientList = attendingEmails;
    } else if (target === 'not_rsvpd') {
      recipientList = notRsvpdEmails;
    }

    if (recipientList.length === 0) {
      return { success: false, error: 'No matching subscribed users found to send email to.' };
    }

    const requestUrl = getRequestURL(event);
    const isLocalhost = requestUrl?.hostname === 'localhost' || requestUrl?.hostname === '127.0.0.1';
    const siteUrl = !isLocalhost && requestUrl?.origin
      ? requestUrl.origin
      : 'https://mjgriffinwedding.netlify.app';
    const html = getAnnouncementEmailTemplate(message, siteUrl);

    // Using BCC to protect privacy and send the mass email efficiently
    const result = await sendEmail({
      bcc: recipientList,
      subject,
      html,
    });

    if (result) {
      return {
        success: true,
        message: 'Announcement sent successfully',
        recipientCount: recipientList.length,
      };
    } else {
      return { success: false, error: 'Failed to send announcement' };
    }
  } catch (err: any) {
    console.error('Exception in send-announcement:', err.message);
    return { success: false, error: 'Internal server error occurred' };
  }
});
