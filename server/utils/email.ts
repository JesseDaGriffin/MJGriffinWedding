import nodemailer from 'nodemailer';

// Nodemailer transporter setup
// Nitro uses the environment variables directly, so we can use process.env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: {
  to?: string;
  bcc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials are not set. Email not sent.');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"The Griffin Wedding" <${process.env.SMTP_USER}>`,
      to: options.to,
      bcc: options.bcc,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export {
  getAnnouncementEmailTemplate,
  getWelcomeEmailTemplate,
  getContactEmailTemplate,
  getRsvpEmailTemplate,
  getQuestionnaireEmailTemplate,
  getSupabaseConfirmEmailTemplate
} from '../../utils/emailTemplates';
