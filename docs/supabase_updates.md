# Supabase Updates Log

This document serves as a ledger for any structural or account-level updates made to the Supabase project.

Whenever an update is required or applied to the Supabase account (such as executing new SQL migrations, adding new tables, modifying Row Level Security (RLS) policies, or tweaking Auth/Storage settings), it must be documented here or in an accompanying update document.

## Pending Updates (Action Required)

The following schema updates and configurations need to be implemented in Supabase to support the initial launch features:

### 1. Database Tables

**`rsvps` Table**
- `id`: `uuid` (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: `uuid` (Foreign Key to `auth.users`, Unique)
- `attending`: `boolean` (Not Null)
- `adults_count`: `integer` (Default: 0)
- `kids_count`: `integer` (Default: 0)
- `attending_ceremony`: `boolean` (Default: false)
- `attending_dinner`: `boolean` (Default: false)
- `created_at`: `timestamptz` (Default: `now()`)

**`questionnaires` Table**
- `id`: `uuid` (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: `uuid` (Foreign Key to `auth.users`, Unique)
- `arrival_date`: `date`
- `departure_date`: `date`
- `activities`: `text[]` (Array of selected activity IDs)
- `suggestions`: `text`
- `created_at`: `timestamptz` (Default: `now()`)

**`contact_messages` Table**
- `id`: `uuid` (Primary Key, Default: `uuid_generate_v4()`)
- `user_id`: `uuid` (Optional, Foreign Key to `auth.users`)
- `name`: `text` (Not Null)
- `email`: `text` (Not Null)
- `subject`: `text` (Not Null)
- `message`: `text` (Not Null)
- `created_at`: `timestamptz` (Default: `now()`)

### 2. Row Level Security (RLS) Policies

- **`rsvps` and `questionnaires`**: 
  - Enable RLS.
  - Policy: `SELECT`, `INSERT`, `UPDATE` allowed only if `auth.uid() = user_id`.
- **`contact_messages`**: 
  - Enable RLS.
  - Policy: `INSERT` allowed for `anon` (unauthenticated) and authenticated users.
  - Policy: `SELECT` restricted to service role/admin only.

### 3. Edge Functions (Optional but Recommended)

- **Contact Form Emailer**: Create an edge function using Resend or Gmail SMTP that triggers via a Database Webhook on `INSERT` into the `contact_messages` table to notify Jesse and Maddie.

### 4. Authentication Flow

- The application handles the `031327` invitation code validation before invoking Supabase Auth.
- Configure Supabase Auth to require email confirmations (optional, based on preference) and ensure standard Email/Password provider is enabled.

## Setup SQL

You can run the following SQL script directly in your Supabase SQL Editor to create the required tables and configure Row Level Security (RLS) policies:

```sql
-- Create rsvps table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  attending BOOLEAN NOT NULL,
  adults_count INTEGER DEFAULT 0,
  kids_count INTEGER DEFAULT 0,
  attending_ceremony BOOLEAN DEFAULT false,
  attending_dinner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create questionnaires table
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  arrival_date DATE,
  departure_date DATE,
  activities TEXT[],
  suggestions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for RSVPs
CREATE POLICY "Users can view their own RSVP" ON rsvps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own RSVP" ON rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVP" ON rsvps
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Questionnaires
CREATE POLICY "Users can view their own questionnaire" ON questionnaires
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own questionnaire" ON questionnaires
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questionnaire" ON questionnaires
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Contact Messages
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view their own contact messages" ON contact_messages
  FOR SELECT USING (auth.uid() = user_id);
```

## Update History

*(New updates to the Supabase account will be appended here as they occur throughout the project)*

### Update: Superuser Permissions (Admin View)
**Date:** May 13, 2026
**Purpose:** Create a superuser role for `dagriffinwedding@gmail.com` to allow viewing all RSVPs, Questionnaires, and Contact Messages.

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create a helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') = 'dagriffinwedding@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies to allow admins to select all records
CREATE POLICY "Admins can view all RSVPs" ON rsvps
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all questionnaires" ON questionnaires
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all contact messages" ON contact_messages
  FOR SELECT USING (public.is_admin());
```
