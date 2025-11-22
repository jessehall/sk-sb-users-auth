# SvelteKit + Supabase + Resend Auth System - Complete Setup Prompt

Use this prompt to recreate this entire authentication system from scratch, including all external service configurations.

---

## PROMPT START

Build a complete authentication and user management system with the following specifications:

### Tech Stack
- **Frontend**: SvelteKit (JavaScript, NO TypeScript)
- **Styling**: Single global CSS file with CSS variables (NO Tailwind)
- **Backend**: Supabase (Auth, Database, RLS)
- **Email**: Resend for all transactional emails
- **Deployment**: Vercel-ready

### Core Features

#### 1. Authentication
- Email/password signup with OTP confirmation code sent via Resend
- Email/password login
- Google OAuth (SSO)
- Logout functionality
- Forgot password flow (send reset link via Resend)
- Update password page

#### 2. User Onboarding
- After signup confirmation or Google OAuth, redirect to onboarding
- Collect: full name, username, website (optional)
- Send welcome email via Resend after profile completion
- Auto-create profile in Supabase on user signup

#### 3. Protected Routes
- `/demo/protected-full` - Fully protected (requires login)
- `/demo/protected-partial` - Partial content protection (some content visible to all, premium content for logged-in users)
- Server-side + client-side auth checks

#### 4. Admin System
- `/admin` - Admin dashboard
- `/admin/users` - User management (view users, reset passwords, delete users)
- Admin role stored in Supabase `profiles.role` field
- Admins use same login as regular users
- Admin pages protected by RLS and server hooks
- Password reset sends email via Resend
- Delete user with confirmation dialog and cascade delete

#### 5. Security Requirements
- Full RLS policies on all tables
- Server hooks to validate JWT on every request using `getUser()` (not `getSession()`)
- No Supabase security warnings in logs
- CSRF protection via SvelteKit
- Secure cookies (httpOnly, sameSite, secure)
- Admin-only operations enforced server-side
- Use `security definer` function to avoid RLS recursion for admin checks

#### 6. Database Schema (Supabase)

**profiles table:**
- id (uuid, FK to auth.users, ON DELETE CASCADE)
- created_at (timestamp with time zone, default now())
- updated_at (timestamp with time zone)
- username (text, unique)
- full_name (text)
- avatar_url (text)
- website (text)
- email (text)
- role (text, default 'user', check: 'user' or 'admin')

**audit_logs table:**
- id (uuid, default gen_random_uuid())
- user_id (uuid, FK to auth.users)
- action (text)
- details (jsonb)
- created_at (timestamp with time zone, default now())

**RLS Policies:**
- Users can insert their own profile
- Users can view/update their own profile
- Admins can view all profiles
- Admins can view audit logs
- Use `is_admin()` security definer function to avoid recursion

**Trigger:**
- Auto-create profile when user signs up via `handle_new_user()` trigger
- Trigger fires on INSERT to auth.users
- Extracts email and metadata from new user

**Storage:**
- Create 'avatars' bucket
- Public read access
- Authenticated users can upload
- Users can update their own avatars

#### 7. Email Templates (Resend)

All emails sent from a verified domain email address (e.g., `noreply@yourdomain.com`).

**Signup confirmation code email:**
- Subject: "Confirm your account"
- Body: Display 6-digit OTP code prominently
- Instruction to enter code on confirmation page

**Welcome email (after onboarding):**
- Subject: "Welcome to [App Name]!"
- Personalized greeting with user's full name
- Thank you message
- Confirmation of full access

**Password reset link email:**
- Subject: "Reset your password"
- Body: Clickable reset link
- Link expires after use

#### 8. File Structure
```
src/
├── hooks.server.js (Supabase SSR, safeGetSession helper)
├── app.html (favicon, meta tags)
├── routes/
│   ├── +layout.svelte (nav, auth state)
│   ├── +layout.server.js (pass user to client)
│   ├── +page.svelte (landing page)
│   ├── signup/
│   │   ├── +page.svelte (signup form with Google button)
│   │   └── +page.server.js (signup + Google OAuth actions)
│   ├── login/
│   │   ├── +page.svelte (login form with Google button)
│   │   └── +page.server.js (login + Google OAuth actions)
│   ├── logout/
│   │   ├── +page.svelte (auto-submit logout)
│   │   └── +page.server.js (logout action)
│   ├── confirm/
│   │   ├── +page.svelte (OTP entry)
│   │   └── +page.server.js (verify OTP)
│   ├── onboarding/
│   │   ├── +page.svelte (profile form)
│   │   └── +page.server.js (save profile, send welcome email)
│   ├── forgot-password/
│   │   ├── +page.svelte (request form)
│   │   └── +page.server.js (generate reset link via Resend)
│   ├── update-password/
│   │   ├── +page.svelte (new password form)
│   │   └── +page.server.js (update password)
│   ├── auth/callback/
│   │   └── +server.js (OAuth callback handler)
│   ├── demo/
│   │   ├── protected-full/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.js (auth check, redirect if not logged in)
│   │   └── protected-partial/
│   │       └── +page.svelte (conditional rendering based on auth)
│   └── admin/
│       ├── +layout.server.js (admin role check)
│       ├── +page.svelte (dashboard)
│       └── users/
│           ├── +page.svelte (user list with delete buttons)
│           └── +page.server.js (fetch users, resetPassword action, deleteUser action)
├── lib/
│   ├── email.js (Resend helpers: sendSignupCode, sendWelcomeEmail, sendPasswordResetEmail)
│   └── server/
│       └── supabase-admin.js (Supabase admin client with service role)
└── styles/
    └── global.css (CSS variables, dark/light mode, component styles)

supabase/
├── schema.sql (full schema with RLS)
├── fix_rls.sql (is_admin function to fix recursion)
└── add_created_at.sql (migration for created_at column)

static/
├── favicon.svg (app icon)
└── robots.txt

Root files:
├── .env.example (environment template)
├── .gitignore (ignore node_modules, .env, build artifacts)
├── README.md (comprehensive documentation)
├── ADMIN_SETUP.md (admin setup guide)
└── RECREATION_PROMPT.md (this file)
```

#### 9. Environment Variables
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
```

#### 10. Design Requirements
- Premium dark/light mode using CSS variables
- HSL colors for primary (hue: 250), success (hue: 150), danger (hue: 0)
- Smooth transitions and hover effects
- Responsive design
- Clean, modern UI with cards, buttons, inputs
- Google Fonts (Inter or similar)
- SVG favicon with app initial

#### 11. Key Implementation Details

**Signup Flow:**
- Use Supabase Admin `generateLink` API to get OTP code
- Send OTP via Resend (not Supabase's default email)
- User enters code on `/confirm` page
- Verify with `verifyOtp`
- Redirect to `/onboarding`

**Auth Hooks:**
- `safeGetSession()` uses `getUser()` to validate JWT (not `getSession()`)
- Return only `user` object from server (not `session`) to avoid security warnings
- Client creates its own Supabase client for session management
- Use `@supabase/ssr` package for server-side auth

**Admin Access:**
- Create SQL function `is_admin()` with `SECURITY DEFINER` to check role
- Use this function in RLS policies to avoid infinite recursion
- Admin routes check role in `+layout.server.js`
- Admin cannot delete themselves (validation in deleteUser action)

**Delete User:**
- Admin-only action in `/admin/users`
- Confirmation dialog before deletion
- Uses Supabase Admin `deleteUser()` API
- Profile auto-deletes via CASCADE constraint
- Loading state on delete button

**Resend Integration:**
- All emails sent via Resend API
- Include proper error handling
- Use verified domain in production (development allows only verified email)
- Update `from` address to match verified domain

**Google OAuth:**
- Available on both `/signup` and `/login` pages
- Uses `signInWithOAuth` with Google provider
- Redirects to `/auth/callback` after OAuth flow
- Callback exchanges code for session

#### 12. Documentation
Create:
- **README.md**: 
  - Complete feature list
  - All routes documented
  - Step-by-step setup instructions
  - Deployment guide (Vercel)
  - Troubleshooting section
  - Project structure
  - Database schema
- **ADMIN_SETUP.md**: How to make users admin, admin features
- **RECREATION_PROMPT.md**: This prompt file
- **.env.example**: Template for environment variables

#### 13. Additional Requirements
- No TypeScript
- No Tailwind CSS
- Clean, commented code
- Error handling on all forms
- Loading states on buttons
- Success/error alerts
- Favicon (SVG)
- SEO-friendly meta tags
- Git repository initialized
- Proper .gitignore (node_modules, .env, build artifacts)

## PROMPT END

---

## Post-Generation Setup Guide

After the AI generates the code, follow these steps to configure external services:

### 1. Supabase Setup

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Enter project name
5. Generate a strong database password
6. Select region (closest to your users)
7. Wait for project to provision (~2 minutes)

#### Get API Keys
1. Go to **Project Settings** → **API**
2. Copy `Project URL` → This is `PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → This is `PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → This is `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

#### Run Database Schema
1. Go to **SQL Editor**
2. Click "New Query"
3. Copy contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables created: Go to **Table Editor** → See `profiles` and `audit_logs`

#### Fix RLS Recursion
1. In **SQL Editor**, create new query
2. Copy contents of `supabase/fix_rls.sql`
3. Run the query
4. This creates the `is_admin()` function

#### Add created_at Column
1. In **SQL Editor**, create new query
2. Copy contents of `supabase/add_created_at.sql`
3. Run the query

#### Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be on by default)
3. For **Google OAuth**:
   - Toggle "Enable Sign in with Google"
   - You'll need Google Client ID and Secret (see Google Setup below)
   - Authorized redirect URL is auto-filled: `https://your-project.supabase.co/auth/v1/callback`

4. Go to **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: Add `http://localhost:5173/auth/callback`
   - For production, add your Vercel URL

5. Go to **Authentication** → **Email Templates**
   - You can customize these, but the app uses Resend for emails
   - Ensure "Confirm signup" is enabled

### 2. Google OAuth Setup (Optional)

#### Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Enter project name → "Create"

#### Configure OAuth Consent Screen
1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose "External" → "Create"
3. Fill in:
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Skip "Scopes" → "Save and Continue"
6. Add test users (your email) → "Save and Continue"

#### Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "SvelteKit Auth"
5. Authorized redirect URIs:
   - Add: `https://your-project.supabase.co/auth/v1/callback`
   - (Get this from Supabase Auth Providers page)
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

#### Add to Supabase
1. Go back to Supabase **Authentication** → **Providers**
2. Find Google provider
3. Paste Client ID and Client Secret
4. Save

### 3. Resend Setup

#### Create Account
1. Go to [resend.com](https://resend.com)
2. Sign up with email
3. Verify your email address

#### Get API Key
1. Go to **API Keys**
2. Click "Create API Key"
3. Name: "SvelteKit Auth"
4. Permission: "Sending access"
5. Click "Add"
6. Copy the API key → This is `RESEND_API_KEY`
7. Store it safely (you can't see it again)

#### Development Mode
- In development, Resend only sends emails to your verified email address
- This is fine for testing

#### Production: Verify Domain

**Option 1: Verify a Domain (Recommended)**
1. Go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Resend will show DNS records to add

**Add DNS Records:**
- Go to your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.)
- Add the TXT, MX, and CNAME records shown by Resend
- Wait for DNS propagation (can take up to 48 hours, usually minutes)
- Return to Resend and click "Verify"

**Option 2: Verify Single Email (Free tier)**
1. Go to **Domains**
2. Click "Verify Single Sender"
3. Enter your email address
4. Check your inbox and click verification link
5. You can now send FROM this email to anyone

#### Update Code
1. Open `src/lib/email.js`
2. Update all `from` addresses:
   ```javascript
   from: 'Your App <noreply@yourdomain.com>'
   ```
   Or for single sender:
   ```javascript
   from: 'Your Name <your@email.com>'
   ```

### 4. DNS Configuration (If Using Custom Domain)

If you want to use a custom domain for your app (e.g., `app.yourdomain.com`):

#### For Vercel Deployment
1. Deploy to Vercel first (see below)
2. Go to Vercel project → **Settings** → **Domains**
3. Add your domain: `app.yourdomain.com`
4. Vercel will show DNS records to add

#### Add DNS Records
Go to your DNS provider and add:
- **Type**: CNAME
- **Name**: `app` (or your subdomain)
- **Value**: `cname.vercel-dns.com`
- **TTL**: Auto or 3600

#### Update Supabase URLs
1. Go to Supabase **Authentication** → **URL Configuration**
2. Update Site URL: `https://app.yourdomain.com`
3. Add to Redirect URLs: `https://app.yourdomain.com/auth/callback`

#### Update Google OAuth (if using)
1. Go to Google Cloud Console → **Credentials**
2. Edit your OAuth client
3. Add to Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

### 5. Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd sk-sb-users-auth

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your keys to .env
# PUBLIC_SUPABASE_URL=...
# PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
# RESEND_API_KEY=...

# Run development server
npm run dev
```

Visit `http://localhost:5173`

### 6. Create First Admin User

1. Sign up at `/signup`
2. Check email for OTP code
3. Enter code at `/confirm`
4. Complete onboarding at `/onboarding`
5. Go to Supabase **Table Editor** → **profiles**
6. Find your user row
7. Change `role` from `'user'` to `'admin'`
8. Log out and log back in
9. Access `/admin`

### 7. Vercel Deployment

#### Via GitHub
1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: SvelteKit (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.svelte-kit` (auto-detected)

6. Add Environment Variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`

7. Click "Deploy"

#### Post-Deployment
1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Update Supabase **URL Configuration**:
   - Site URL: Your Vercel URL
   - Redirect URLs: Add `https://your-app.vercel.app/auth/callback`
3. Test the deployed app

### 8. Testing Checklist

- [ ] Email/password signup works
- [ ] OTP code received via email
- [ ] Email confirmation works
- [ ] Onboarding flow works
- [ ] Welcome email received
- [ ] Google OAuth signup works
- [ ] Google OAuth login works
- [ ] Email/password login works
- [ ] Forgot password sends email
- [ ] Password reset link works
- [ ] Protected routes redirect when not logged in
- [ ] Admin can access `/admin`
- [ ] Admin can view users
- [ ] Admin can reset user passwords
- [ ] Admin can delete users
- [ ] Regular users cannot access admin routes
- [ ] Logout works

## Service Costs (as of 2024)

- **Supabase**: Free tier includes 500MB database, 50,000 monthly active users
- **Resend**: Free tier includes 3,000 emails/month, 1 verified domain
- **Vercel**: Free tier includes unlimited deployments, 100GB bandwidth
- **Google OAuth**: Free

Total cost for small projects: **$0/month**

## Troubleshooting

### Supabase
- **RLS errors**: Make sure you ran `fix_rls.sql`
- **Profile not created**: Check trigger exists in SQL Editor
- **Can't access admin**: Verify role is 'admin' in profiles table

### Resend
- **Emails not sending**: Check API key is correct
- **Can only send to self**: Verify domain or use verified single sender
- **DNS not verifying**: Wait up to 48 hours for propagation

### Google OAuth
- **Redirect URI mismatch**: Ensure Supabase callback URL is in Google Console
- **OAuth not working**: Check Client ID and Secret are correct in Supabase

### Vercel
- **Build fails**: Check environment variables are set
- **404 errors**: Ensure SvelteKit adapter is configured correctly

---

**This prompt and setup guide provide everything needed to recreate the complete authentication system from scratch, including all external service configurations.**
