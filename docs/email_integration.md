# Email Integration Setup

This document outlines the steps required to configure the emailing features (Welcome emails on sign up and Admin Announcements) for the MJ Griffin Wedding website.

The application uses **Nodemailer** with Gmail's SMTP server to send emails. Because modern Gmail security does not allow the use of your standard account password for third-party apps, you will need to generate a specific "App Password" to authenticate the server.

## 1. Generating a Gmail App Password

1. Go to your Google Account (ensure you are logged into `dagriffinwedding@gmail.com`).
2. Navigate to **Security** on the left-hand menu.
3. Under the "How you sign in to Google" section, ensure **2-Step Verification** is turned ON. (You must have this enabled to create App Passwords).
4. Go to **2-Step Verification** settings, scroll to the bottom, and select **App passwords**.
5. Select the app as "Mail" and the device as "Other (Custom name)". You can name it "Nuxt Website" or similar.
6. Click **Generate**.
7. Google will display a 16-character password in a yellow box. **Save this password**. You will not be able to see it again.

## 2. Setting Environment Variables

The email feature relies on the following environment variables.

### Local Development (`.env`)
Create or edit the `.env` file at the root of the project to include the following:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dagriffinwedding@gmail.com
SMTP_PASS=your-16-character-app-password
```
*(Replace `your-16-character-app-password` with the password generated in Step 1. Do not include spaces).*

### Production (Netlify)
When deploying to Netlify, your Nuxt Server APIs become Netlify Functions. The environment variables must be securely added to your Netlify project:
1. Go to your Netlify dashboard for this project.
2. Navigate to **Site configuration > Environment variables**.
3. Add the four variables exactly as they appear above (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
4. **Trigger a new deployment** to ensure the Netlify Functions pick up the new environment variables.

## 3. How the Features Work

- **Welcome Email:** When a user completes the sign-up process (after entering the correct invitation code), the client-side code immediately triggers a POST request to `/api/send-welcome`. The server compiles the HTML template and sends it via Nodemailer to the user's email address.
- **Admin Announcements:** The `/announcements` page is protected and only visible to the admin. When you fill out the subject and message and click Send, it queries Supabase for all registered users' emails, then triggers a POST request to `/api/send-announcement` which sends out a single BCC email containing all recipients. This protects user privacy and is efficient.
