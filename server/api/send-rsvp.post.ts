import { defineEventHandler, readBody } from 'h3';
import { sendEmail, getRsvpEmailTemplate } from '../utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, attending, ceremony, dinner, afterparty } = body;

  const html = getRsvpEmailTemplate(name, email, attending, ceremony, dinner, afterparty);

  const success = await sendEmail({
    to: 'dagriffinwedding@gmail.com',
    subject: `New RSVP from ${name || email}`,
    html: html,
  });

  if (!success) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send RSVP email notification',
    });
  }

  return { success: true };
});
