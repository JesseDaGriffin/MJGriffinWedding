# Supabase Auth Email Templates

By default, Supabase sends basic, unstyled text emails when a user signs up and needs to verify their email address. To match the aesthetic of your wedding website, you can replace the default template with the custom HTML one provided below.

## How to Set Up the Custom Template

1. Log in to your [Supabase Dashboard](https://app.supabase.com).
2. Select your project.
3. On the left sidebar, click on **Authentication** (the user icon).
4. Under the Configuration section in the side menu, click on **Email Templates**.
5. Select the **Confirm signup** tab (or whatever email you wish to update).
6. Under **Message Body**, switch the editor (if applicable) to accept raw HTML, or just paste the code below directly into the Source code editor.
7. Click **Save**.

> **Note:** Supabase uses special variables like `{{ .ConfirmationURL }}` to dynamically inject the verification link. The template below already includes this variable.

---

## The Custom HTML Template

Copy the code block below and paste it directly into the Message Body field in Supabase:

```html
<!DOCTYPE html>
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
            <h1>Verify your email address</h1>
          </div>
          <div class="content">
            <h2>Verify your email address</h2>
            <p>Thank you for registering on our wedding website! To complete your registration and access the itinerary and RSVP, please confirm your email address by clicking the button below.</p>
            <div class="btn-container">
              <a href="{{ .ConfirmationURL }}" class="btn" style="color: #080606 !important;">Confirm Email</a>
            </div>
          </div>
          <div class="footer">
            <p>The Griffin Wedding — March 13, 2027</p>
            <p>If you did not create an account on our site, you can safely ignore this email.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Optional: Updating the Subject Line
While on the **Confirm signup** tab in Supabase, you can also update the **Subject** field to something more personalized, such as:
`Verify your email for The Griffin Wedding!`
