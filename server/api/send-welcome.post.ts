import { defineEventHandler, readBody } from 'h3';
import { sendEmail, getWelcomeEmailTemplate } from '../utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, firstName } = body;

  if (!email || !firstName) {
    return { success: false, error: 'Email and firstName are required' };
  }

  const html = getWelcomeEmailTemplate(firstName);

  const result = await sendEmail({
    to: email,
    subject: 'Welcome to the Griffin Wedding!',
    html,
  });

  if (result) {
    return { success: true, message: 'Welcome email sent successfully' };
  } else {
    return { success: false, error: 'Failed to send welcome email' };
  }
});
