import nodemailer from 'nodemailer';
import { getCookie, type H3Event } from 'h3';
import { serverSupabaseUser } from '#supabase/server';

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

export const isAuthorizedAdmin = async (event: H3Event): Promise<boolean> => {
  if (process.dev && getCookie(event, 'sb_bypass_auth') === 'true') {
    return true;
  }

  try {
    const user = await serverSupabaseUser(event);
    return user?.email?.toLowerCase() === 'dagriffinwedding@gmail.com';
  } catch {
    return false;
  }
};

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

export const getAnnouncementRecipients = async (supabaseAdmin: any) => {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Fetch profiles to check receive_announcements column if present
  const profileMap = new Map<string, any>();
  const { data: profilesData, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*');

  if (!profilesError && Array.isArray(profilesData)) {
    for (const p of profilesData) {
      profileMap.set(p.id, p);
    }
  }

  const emails: string[] = [];
  let optedOutCount = 0;

  for (const user of authData.users) {
    if (!user.email) continue;

    const profile = profileMap.get(user.id);
    const metaPref = user.user_metadata?.receive_announcements;
    const profilePref = profile?.receive_announcements;

    const isOptedOut = profilePref === false || metaPref === false;

    if (isOptedOut) {
      optedOutCount++;
    } else {
      emails.push(user.email);
    }
  }

  return {
    emails,
    optedOutCount,
    totalUsers: authData.users.filter((u: any) => u.email).length,
  };
};

export {
  getAnnouncementEmailTemplate,
  getWelcomeEmailTemplate,
  getContactEmailTemplate,
  getRsvpEmailTemplate,
  getQuestionnaireEmailTemplate,
  getSupabaseConfirmEmailTemplate,
  getSupabaseResetPasswordEmailTemplate
} from '../../utils/emailTemplates';
