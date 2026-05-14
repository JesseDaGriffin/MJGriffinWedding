# Gmail SMTP Server Setup

This document explains how to set up Gmail to act as the mail server for this project. Because Google no longer supports "Less Secure Apps," we will need to use an **App Password** to authenticate the SMTP connection securely.

## 1. Enable 2-Step Verification
Before you can create an App Password, your Google account must have 2-Step Verification enabled.
1. Go to your [Google Account](https://myaccount.google.com/).
2. On the left navigation panel, click **Security**.
3. Under the "How you sign in to Google" section, click on **2-Step Verification**.
4. Follow the on-screen steps to enable it if it isn't already.

## 2. Generate an App Password
1. Once 2-Step Verification is active, go back to the **Security** page.
2. In the search bar at the top, type **App passwords** and select the result.
3. You may be prompted to sign in again.
4. In the "Select app" dropdown, choose **Other (Custom name)** and name it something like `MJGriffinWedding Site`.
5. Click **Generate**.
6. A modal will appear with a 16-character password. **Copy this password** and save it somewhere secure. You won't be able to view it again once you close the window.

## 3. Server Integration Settings
When configuring the environment variables for your application, use the following SMTP details:

- **SMTP Host:** `smtp.gmail.com`
- **SMTP Port:** `587` (TLS) or `465` (SSL)
- **SMTP Username:** Your full Gmail address (e.g., `youremail@gmail.com`)
- **SMTP Password:** The 16-character App Password generated in step 2 (without spaces)

### Example Environment Variables (`.env`)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your-16-character-app-password
```

## 4. Notes on Usage
- Gmail has sending limits (typically ~500 emails per day for standard accounts). If this site exceeds that volume, consider moving to a dedicated email service provider like Resend, SendGrid, or AWS SES.
- Do not commit the `.env` file containing the App Password to version control.
