export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const html = getContactEmailTemplate(name, email, subject, message);

  // Send the email to the wedding admin email address
  const success = await sendEmail({
    to: 'dagriffinwedding@gmail.com',
    subject: `New Contact Form Message: ${subject}`,
    html: html,
  });

  if (!success) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email',
    });
  }

  return { success: true };
});
