# SvelteKit + Supabase + Resend Auth Starter

A complete authentication and user management system built with SvelteKit, Supabase, and Resend.

## Features

- **Authentication**: Email/Password (with OTP confirmation), Google SSO.
- **User Management**: Onboarding flow, Profile creation.
- **Protected Routes**: Server-side and Client-side protection.
- **Admin System**: User management, Admin role enforcement.
- **Email**: Transactional emails via Resend.
- **Security**: RLS, Secure Cookies, CSRF protection.
- **Styling**: Premium global CSS (No Tailwind).

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env` (create it if it doesn't exist) and fill in the values:

```bash
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

### 2. Supabase Setup

1. Create a new Supabase project.
2. Go to the SQL Editor and run the contents of `supabase/schema.sql`.
3. Go to Authentication -> Providers and enable Google (if using SSO).
4. Go to Authentication -> Email Templates and configure if needed (or use Resend manually as implemented).
5. **Important**: Ensure "Enable Email Confirmations" is ON.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

## Deployment (Vercel)

1. Push code to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel Project Settings.
4. Deploy.

## Admin Access

To make a user an admin:
1. Sign up normally.
2. Go to Supabase Table Editor -> `profiles` table.
3. Change the `role` column of your user from `user` to `admin`.
4. Log out and log back in to access `/admin`.

## File Structure

- `src/routes`: Application routes.
- `src/lib`: Shared code (Supabase client, Email helper).
- `src/styles`: Global CSS.
- `supabase`: Database schema.
