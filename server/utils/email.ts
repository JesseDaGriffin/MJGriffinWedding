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
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const getWelcomeEmailTemplate = (firstName: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .header h1 { color: #6b8e23; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif; font-weight: 600; }
      .content { padding: 30px 0; text-align: center; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
      .btn { display: inline-block; padding: 12px 28px; background-color: #6b8e23; color: #ffffff !important; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
      h2 { color: #eaeaea; font-family: 'Playfair Display', serif; }
      a { color: #9e591f; text-decoration: none; }
    </style>
  </head>
  <body style="background-color: #1c1c1c;">
    <div class="container" style="background-color: #242424;">
      <div class="header">
        <h1>Welcome to the Griffin Wedding!</h1>
      </div>
      <div class="content">
        <h2 style="margin-top: 0;">Hi ${firstName},</h2>
        <p>Thank you for signing up on our wedding website! We are so excited to celebrate our special day with you on March 13, 2027.</p>
        <p>You can now log in to RSVP, view the itinerary, and submit your travel details. If you have any questions, feel free to use the contact form on the site.</p>
        <div>
          <a href="https://mjgriffinwedding.netlify.app" class="btn" style="color: #ffffff;">Visit Website</a>
        </div>
      </div>
      <div class="footer">
        <p>The Griffin Wedding — March 13, 2027</p>
        <p>Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getAnnouncementEmailTemplate = (messageHtml: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .header h1 { color: #6b8e23; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif; font-weight: 600; }
      .content { padding: 30px 0; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
      a { color: #9e591f; text-decoration: none; }
    </style>
  </head>
  <body style="background-color: #1c1c1c;">
    <div class="container" style="background-color: #242424;">
      <div class="header">
        <h1>Wedding Announcement</h1>
      </div>
      <div class="content">
        ${messageHtml}
      </div>
      <div class="footer">
        <p>The Griffin Wedding — March 13, 2027</p>
        <p>Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getContactEmailTemplate = (name: string, email: string, subject: string, message: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); }
      .header { padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .header h1 { color: #6b8e23; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif; font-weight: 600; }
      .content { padding: 30px 0; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
      .detail-row { margin-bottom: 15px; }
      .label { color: #9e591f; font-weight: 600; }
    </style>
  </head>
  <body style="background-color: #1c1c1c;">
    <div class="container" style="background-color: #242424;">
      <div class="header">
        <h1>New Contact Message</h1>
      </div>
      <div class="content">
        <div class="detail-row">
          <span class="label">Name:</span> ${name}
        </div>
        <div class="detail-row">
          <span class="label">Email:</span> ${email}
        </div>
        <div class="detail-row">
          <span class="label">Subject:</span> ${subject}
        </div>
        <div class="detail-row" style="margin-top: 20px; padding: 15px; background-color: rgba(0,0,0,0.2); border-radius: 4px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
      <div class="footer">
        <p>This message was sent from the Griffin Wedding contact form.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const getRsvpEmailTemplate = (name: string, email: string, attending: boolean, adults: number, kids: number, ceremony: boolean, dinner: boolean) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); }
      .header { padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; }
      .header h1 { color: #6b8e23; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif; font-weight: 600; }
      .content { padding: 30px 0; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
      .detail-row { margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
      .label { color: #9e591f; font-weight: 600; display: inline-block; width: 150px; }
      .status-yes { color: #4CAF50; font-weight: bold; }
      .status-no { color: #F44336; font-weight: bold; }
    </style>
  </head>
  <body style="background-color: #1c1c1c;">
    <div class="container" style="background-color: #242424;">
      <div class="header">
        <h1>New RSVP Received!</h1>
      </div>
      <div class="content">
        <div class="detail-row">
          <span class="label">Guest Name:</span> ${name || 'Unknown'}
        </div>
        <div class="detail-row">
          <span class="label">Email:</span> ${email || 'Unknown'}
        </div>
        <div class="detail-row">
          <span class="label">Attending:</span> 
          <span class="${attending ? 'status-yes' : 'status-no'}">${attending ? 'Yes, Joyfully Accepting' : 'No, Regretfully Declining'}</span>
        </div>
        ${attending ? `
        <div class="detail-row">
          <span class="label">Adults:</span> ${adults}
        </div>
        <div class="detail-row">
          <span class="label">Children:</span> ${kids}
        </div>
        <div class="detail-row">
          <span class="label">Ceremony:</span> ${ceremony ? 'Yes' : 'No'}
        </div>
        <div class="detail-row">
          <span class="label">Dinner:</span> ${dinner ? 'Yes' : 'No'}
        </div>
        ` : ''}
      </div>
      <div class="footer">
        <p>This automated message was sent from your wedding website.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
