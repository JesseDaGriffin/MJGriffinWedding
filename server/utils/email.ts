import nodemailer from 'nodemailer';
import { getCookie, type H3Event } from 'h3';
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server';
import { isAdminUser } from '../../utils/admin';

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
    const user: any = await serverSupabaseUser(event);
    if (!user) return false;
    if (isAdminUser(user)) return true;

    // Fallback: check live auth.users record in case app_metadata was updated after token issuance
    const userId = user.id || user.sub;
    if (userId) {
      const supabaseAdmin = await serverSupabaseServiceRole(event);
      const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
      return isAdminUser(data?.user);
    }
    return false;
  } catch {
    return false;
  }
};

export const setUserAdminByEmail = async (
  supabaseAdmin: any,
  email: string,
  isAdmin: boolean = true
): Promise<{ success: boolean; message?: string; error?: string }> => {
  const normalizedEmail = email?.trim()?.toLowerCase();
  if (!normalizedEmail) {
    return { success: false, error: 'A valid email address is required.' };
  }

  if (!isAdmin && normalizedEmail === 'dagriffinwedding@gmail.com') {
    return {
      success: false,
      error: 'Cannot remove admin access from dagriffinwedding@gmail.com.',
    };
  }

  const { data: authData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    return { success: false, error: listError.message };
  }

  const targetUser = (authData?.users || []).find(
    (u: any) => u.email?.toLowerCase() === normalizedEmail
  );

  if (!targetUser) {
    return {
      success: false,
      error: `No registered account found for ${normalizedEmail}.`,
    };
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUser.id,
    {
      app_metadata: {
        ...(targetUser.app_metadata || {}),
        is_admin: isAdmin,
      },
    }
  );

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // When promoting a user to admin, remove any existing RSVP record so they aren't counted in RSVPs
  if (isAdmin) {
    await supabaseAdmin.from('rsvps').delete().eq('user_id', targetUser.id);
  }

  return {
    success: true,
    message: isAdmin
      ? `${targetUser.email} has been set as an admin.`
      : `Admin access removed for ${targetUser.email}.`,
  };
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

  // Fetch RSVPs to check attending status
  const rsvpMap = new Map<string, any>();
  const { data: rsvpsData, error: rsvpsError } = await supabaseAdmin
    .from('rsvps')
    .select('user_id, attending');

  if (!rsvpsError && Array.isArray(rsvpsData)) {
    for (const r of rsvpsData) {
      rsvpMap.set(r.user_id, r);
    }
  }

  const emails: string[] = [];
  const attendingEmails: string[] = [];
  const notRsvpdEmails: string[] = [];
  let optedOutCount = 0;
  let declinedCount = 0;
  let totalUsers = 0;

  for (const user of authData.users) {
    if (!user.email) continue;

    if (isAdminUser(user)) {
      continue;
    }

    totalUsers++;

    const profile = profileMap.get(user.id);
    const metaPref = user.user_metadata?.receive_announcements;
    const profilePref = profile?.receive_announcements;

    const isOptedOut = profilePref === false || metaPref === false;

    if (isOptedOut) {
      optedOutCount++;
      continue;
    }

    const rsvp = rsvpMap.get(user.id);
    const hasRsvpd = rsvp !== undefined && rsvp.attending !== null && rsvp.attending !== undefined;

    if (hasRsvpd && rsvp.attending === false) {
      declinedCount++;
      continue;
    }

    // User is subscribed and has not declined
    emails.push(user.email);

    if (hasRsvpd && rsvp.attending === true) {
      attendingEmails.push(user.email);
    } else {
      notRsvpdEmails.push(user.email);
    }
  }

  return {
    emails,
    attendingEmails,
    notRsvpdEmails,
    optedOutCount,
    declinedCount,
    totalUsers,
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
