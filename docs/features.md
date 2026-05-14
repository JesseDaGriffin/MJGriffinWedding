# Site Features & Architecture

This document explains the core functionalities of the project, how different features are implemented, and the overall architecture of the site.

## Overview
The MJ Griffin Wedding application serves as the central hub for guests attending the wedding. It provides necessary travel and itinerary details, a registry, and an interactive system for guests to RSVP, fill out a pre-wedding questionnaire, and contact the couple.

## Core Features

### 1. Pre-Authentication (Invitation Code)
Before creating an account or logging in, guests must enter a specific invitation code (`031327`). This prevents unauthorized access to private wedding details and limits account creation to invited guests.

### 2. User Authentication
Powered by Supabase Auth (Email/Password). Once the invitation code is validated, users can sign up or log in. An admin account (`dagriffinwedding@gmail.com`) has superuser privileges to view all data.

### 3. RSVP System
Guests can submit their RSVP status, including:
- Whether they are attending.
- Number of adults and kids.
- Specific events they will attend (Ceremony, Dinner).
Data is stored securely in Supabase and tied to the user's auth ID.

### 4. Questionnaires
A system for guests to provide additional travel details:
- Arrival and departure dates.
- Activities they are interested in.
- General suggestions or notes.

### 5. Contact Form & Notifications
A contact page allows users (authenticated or anonymous) to send a message to Jesse and Maddie. A database webhook triggers an Edge Function to send an email notification to the couple whenever a new message is inserted.

### 6. Informational Pages
Static and dynamic content pages include:
- **Itinerary (`/itinerary`):** Schedule of events.
- **Travel (`/travel`):** Information on flights, hotels, and local transport.
- **Registry (`/registry`):** Links or information regarding the couple's wedding registry.
- **Admin Responses View (`/responses`):** A protected route where the admin can view all submitted RSVPs, questionnaires, and messages.
