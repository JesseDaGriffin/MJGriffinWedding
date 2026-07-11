const wrapEmailHtml = (
  title: string,
  contentHtml: string,
  footerHtml: string = '<p>The Griffin Wedding — March 13, 2027</p><p>Please do not reply directly to this email.</p>'
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;600&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #a8a39a;
      line-height: 1.7;
      background-color: #110d14;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 30px;
      border-radius: 4px;
      background-color: #0c0a0a;
      border: 1px solid rgba(197, 168, 128, 0.2);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .logo-container {
      text-align: center;
      margin-bottom: 25px;
    }
    .logo-text {
      font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
      font-size: 38px;
      font-weight: 700;
      color: #c5a880;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      display: inline-block;
      margin-right: -0.25em;
    }
    .header {
      text-align: center;
      padding-bottom: 25px;
      border-bottom: 1px solid rgba(197, 168, 128, 0.15);
      margin-bottom: 25px;
    }
    .header h1 {
      color: #e5e0d8;
      margin: 0;
      font-size: 22px;
      font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .content {
      color: #a8a39a;
      font-size: 15px;
    }
    .content h2 {
      color: #c5a880;
      font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 15px;
      letter-spacing: 0.05em;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 20px;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background-color: #c5a880;
      color: #080606 !important;
      text-decoration: none;
      border-radius: 4px;
      font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(197, 168, 128, 0.15);
    }
    .detail-row {
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(197, 168, 128, 0.08);
      padding-bottom: 12px;
      font-size: 14px;
      color: #a8a39a;
    }
    .detail-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .label {
      color: #a290b4;
      font-weight: 600;
      display: inline-block;
      width: 150px;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .value {
      color: #e5e0d8;
    }
    .value-box {
      margin-top: 15px;
      padding: 20px;
      background-color: #110d14;
      border: 1px solid rgba(197, 168, 128, 0.1);
      border-radius: 4px;
      color: #a8a39a;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
    .status-yes {
      color: #799154;
      font-weight: bold;
    }
    .status-no {
      color: #b53c4d;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding-top: 25px;
      border-top: 1px solid rgba(197, 168, 128, 0.15);
      font-size: 11px;
      color: rgba(168, 163, 154, 0.5);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 25px;
    }
    .footer p {
      margin: 5px 0;
    }
    a {
      color: #c5a880;
      text-decoration: none;
    }
  </style>
</head>
<body style="background-color: #110d14; margin: 0; padding: 0; height: 100%; width: 100%;">
  <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #110d14; height: 100%; min-height: 100vh;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 20px;">
        <div class="container" style="background-color: #0c0a0a; color: #a8a39a; text-align: left;">
          <div class="logo-container">
            <span class="logo-text">M &amp; J</span>
          </div>
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            ${footerHtml}
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const getAnnouncementEmailTemplate = (messageHtml: string) => {
  return wrapEmailHtml('Wedding Announcement', messageHtml);
};

export const getWelcomeEmailTemplate = (firstName: string) => {
  const content = `
    <h2>Hi ${firstName},</h2>
    <p>Thank you for signing up on our wedding website! We are so excited to celebrate our special day with you on March 13, 2027.</p>
    <p>You can now log in to RSVP, view the itinerary, and submit your travel details. If you have any questions, feel free to use the contact form on the site.</p>
    <div class="btn-container">
      <a href="https://mjgriffinwedding.netlify.app" class="btn">Visit Website</a>
    </div>
  `;
  return wrapEmailHtml('Welcome to the Griffin Wedding!', content);
};

export const getContactEmailTemplate = (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const content = `
    <div class="detail-row">
      <span class="label">Name:</span>
      <span class="value">${name}</span>
    </div>
    <div class="detail-row">
      <span class="label">Email:</span>
      <span class="value"><a href="mailto:${email}" style="color: #c5a880;">${email}</a></span>
    </div>
    <div class="detail-row">
      <span class="label">Subject:</span>
      <span class="value">${subject}</span>
    </div>
    <div class="value-box">
      ${message.replace(/\n/g, '<br>')}
    </div>
  `;
  const footer = `<p>This message was sent from the Griffin Wedding contact form.</p>`;
  return wrapEmailHtml('New Contact Message', content, footer);
};

export const getRsvpEmailTemplate = (
  name: string,
  email: string,
  attending: boolean,
  ceremony: { attending: boolean; adults: number; kids: number },
  dinner: { attending: boolean; adults: number; kids: number },
  afterparty: { attending: boolean; adults: number }
) => {
  const content = `
    <div class="detail-row">
      <span class="label">Guest Name:</span>
      <span class="value">${name || 'Unknown'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Email:</span>
      <span class="value">${email || 'Unknown'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Attending:</span>
      <span class="${attending ? 'status-yes' : 'status-no'}">
        ${attending ? 'Yes, Joyfully Accepting' : 'No, Regretfully Declining'}
      </span>
    </div>
    ${
      attending
        ? `
    <div class="detail-row">
      <span class="label">Ceremony:</span>
      <span class="value">${
        ceremony.attending
          ? `Yes (${ceremony.adults} Adults, ${ceremony.kids} Kids)`
          : 'No'
      }</span>
    </div>
    <div class="detail-row">
      <span class="label">Dinner:</span>
      <span class="value">${
        dinner.attending
          ? `Yes (${dinner.adults} Adults, ${dinner.kids} Kids)`
          : 'No'
      }</span>
    </div>
    <div class="detail-row">
      <span class="label">21+ After Party:</span>
      <span class="value">${
        afterparty.attending ? `Yes (${afterparty.adults} Guests)` : 'No'
      }</span>
    </div>
    `
        : ''
    }
  `;
  const footer = `<p>This automated message was sent from your wedding website.</p>`;
  return wrapEmailHtml('New RSVP Received!', content, footer);
};

export const getQuestionnaireEmailTemplate = (
  name: string,
  email: string,
  arrivalDate: string,
  departureDate: string,
  activities: string[],
  suggestions: string
) => {
  const content = `
    <div class="detail-row">
      <span class="label">Guest Name:</span>
      <span class="value">${name || 'Unknown'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Email:</span>
      <span class="value">${email || 'Unknown'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Arrival Date:</span>
      <span class="value">${arrivalDate || 'Not provided'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Departure Date:</span>
      <span class="value">${departureDate || 'Not provided'}</span>
    </div>
    <div class="detail-row">
      <span class="label">Activities:</span>
      <span class="value">${
        activities && activities.length > 0
          ? activities.join(', ')
          : 'None selected'
      }</span>
    </div>
    <div class="detail-row">
      <span class="label">Suggestions:</span>
      <span class="value">${suggestions || 'None'}</span>
    </div>
  `;
  const footer = `<p>This automated message was sent from your wedding website.</p>`;
  return wrapEmailHtml('New Questionnaire Received', content, footer);
};

export const getSupabaseConfirmEmailTemplate = (confirmationUrl: string = '{{ .ConfirmationURL }}') => {
  const content = `
    <h2>Verify your email address</h2>
    <p>Thank you for registering on our wedding website! To complete your registration and access the itinerary and RSVP, please confirm your email address by clicking the button below.</p>
    <div class="btn-container">
      <a href="${confirmationUrl}" class="btn" style="color: #080606 !important;">Confirm Email</a>
    </div>
  `;
  const footer = `
    <p>The Griffin Wedding — March 13, 2027</p>
    <p>If you did not create an account on our site, you can safely ignore this email.</p>
  `;
  return wrapEmailHtml('Verify your email address', content, footer);
};
