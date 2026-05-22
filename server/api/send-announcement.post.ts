import { defineEventHandler, readBody } from 'h3';
import { sendEmail, getAnnouncementEmailTemplate } from '../utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { emails, subject, message } = body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return { success: false, error: 'A list of recipient emails is required' };
  }

  if (!subject || !message) {
    return { success: false, error: 'Subject and message are required' };
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
});
