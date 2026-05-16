# Project Initialization and Setup

This document tracks the steps necessary to recreate the project infrastructure, including database schemas, integrations, and environment setup.

## Technologies Used
- **Frontend/Backend Framework:** Nuxt.js
- **Database & Authentication:** Supabase
- **Hosting:** Netlify
- **Email Service:** Gmail (SMTP / Integration)

## Supabase Initialization
The database schema, RLS policies, and admin roles have been fully defined.

**Please reference [`docs/supabase_updates.md`](./supabase_updates.md) for the complete initialization SQL scripts and updates.**

The initial schema includes setup for:
- **`rsvps` table:** Track attendance, counts, and event RSVPs.
- **`questionnaires` table:** Track guest travel dates and activity interests.
- **`contact_messages` table:** Track contact forms sent by guests.
- **`profiles` table:** Track user first and last names for personalized interaction and admin dashboard mapping.
- **Authentication:** Custom function for the `dagriffinwedding@gmail.com` admin superuser role, Postgres triggers for automatic profile creation, and user-based Row Level Security (RLS) policies.

## Deployment & Hosting (Netlify)
*(Deployment steps and build configuration will be logged here)*

## Email Integration (Gmail)
The application uses Gmail to send outgoing emails (e.g., contact form notifications to Jesse and Maddie). 
**Please reference [`docs/gmail_setup.md`](./gmail_setup.md) for step-by-step instructions on configuring the Google App Password and SMTP details.**
