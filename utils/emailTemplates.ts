export const getAnnouncementEmailTemplate = (messageHtml: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: #242424; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); color: #eaeaea; }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      .header h1 { color: #6b8e23; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif; font-weight: 600; }
      .content { padding: 30px 0; color: #eaeaea; }
      .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
      a { color: #6b8e23; text-decoration: none; font-weight: bold; }
    </style>
  </head>
  <body style="background-color: #1c1c1c; margin: 0; padding: 0; height: 100%; width: 100%;">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1c1c1c; height: 100%; min-height: 100vh;">
      <tr>
        <td align="center" valign="top" style="padding: 20px;">
          <div class="container" style="background-color: #242424; color: #eaeaea; text-align: left;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #ffffff;">M &amp; J</span>
            </div>
            <div class="header">
              <h1>Wedding Announcement</h1>
            </div>
            <div class="content" style="color: #eaeaea;">
              ${messageHtml}
            </div>
            <div class="footer">
              <p>The Griffin Wedding — March 13, 2027</p>
              <p>Please do not reply directly to this email.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
