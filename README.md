# MJ Griffin Wedding Project

This is the repository for the MJ Griffin Wedding web application. It serves as a central portal for wedding guests to RSVP, view the itinerary, provide travel details, manage their guest profiles, and contact the couple.

## Tech Stack
- **Framework:** Nuxt.js
- **Database/Auth:** Supabase
- **Hosting:** Netlify
- **Email:** Gmail (SMTP)

## Documentation
For deeper insights into the project, please reference the `docs` directory:
- [Features & Architecture](./docs/features.md) - Explanations of site functionality, pre-auth codes, and feature implementation.
- [Project Initialization](./docs/project_init.md) - Details on project setup and integrations.
- [Supabase Updates Log](./docs/supabase_updates.md) - Database schema, RLS policies, and SQL setup scripts.
- [Gmail Setup](./docs/gmail_setup.md) - Configuration for the SMTP mail server.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (or your preferred package manager)
- A Supabase Project
- A Gmail account with 2-Step Verification enabled

### Setup

Make sure to install the dependencies:

```bash
npm install
```

### Environment Variables
Create a `.env` file in the root of the project. You will need variables similar to this:

```env
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dagriffinwedding@gmail.com
SMTP_PASS=your-16-character-app-password
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```
