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
  <style>
    body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #eaeaea; line-height: 1.6; background-color: #1c1c1c; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; background-color: #242424; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37); color: #eaeaea; }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .header h1 { color: #6b8e23; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif; font-weight: 600; }
    .content { padding: 30px 0; text-align: center; color: #eaeaea; }
    .footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.5); }
    .btn { display: inline-block; padding: 12px 28px; background-color: #6b8e23; color: #ffffff !important; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
    h2 { color: #eaeaea; font-family: 'Playfair Display', serif; }
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
            <h1>The Griffin Wedding</h1>
          </div>
          <div class="content" style="color: #eaeaea;">
            <h2 style="margin-top: 0; color: #eaeaea;">Verify your email address</h2>
            <p>Thank you for registering on our wedding website! To complete your registration and access the itinerary and RSVP, please confirm your email address by clicking the button below.</p>
            <div style="text-align: center;">
              <!-- Supabase dynamically injects the link here -->
              <a href="{{ .ConfirmationURL }}" class="btn" style="color: #ffffff;">Confirm Email</a>
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
