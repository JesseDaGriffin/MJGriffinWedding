import { defineEventHandler, readBody } from 'h3';
import { sendEmail, getQuestionnaireEmailTemplate } from '../utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, arrivalDate, departureDate, activities, suggestions } = body;

  const html = getQuestionnaireEmailTemplate(name, email, arrivalDate, departureDate, activities, suggestions);

  const success = await sendEmail({
    to: 'dagriffinwedding@gmail.com',
    subject: `New Questionnaire: ${name || email}`,
    html: html,
    replyTo: email,
  });

  if (!success) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send questionnaire email notification',
    });
  }

  return { success: true };
});
