# SvelteKit + Supabase + Resend Auth System - Complete Setup Prompt

Use this prompt to recreate this entire authentication system from scratch:

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
- `/admin/users` - User management (view users, reset passwords)
- Admin role stored in Supabase `profiles.role` field
- Admins use same login as regular users
- Admin pages protected by RLS and server hooks
- Password reset sends email via Resend

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
- id (uuid, FK to auth.users)
- created_at (timestamp)
- updated_at (timestamp)
- username (text, unique)
- full_name (text)
- avatar_url (text)
- website (text)
- email (text)
- role (text, default 'user', check: 'user' or 'admin')

**audit_logs table:**
- id (uuid)
- user_id (uuid, FK to auth.users)
- action (text)
- details (jsonb)
- created_at (timestamp)

**RLS Policies:**
- Users can view/update their own profile
- Admins can view all profiles
- Admins can view audit logs
- Use `is_admin()` security definer function to avoid recursion

**Trigger:**
- Auto-create profile when user signs up via `handle_new_user()` trigger

#### 7. Email Templates (Resend)
- Signup confirmation code email
- Welcome email (after onboarding)
- Password reset link email

#### 8. File Structure
```
src/
├── hooks.server.js (Supabase SSR, safeGetSession helper)
├── routes/
│   ├── +layout.svelte (nav, auth state)
│   ├── +layout.server.js (pass user to client)
│   ├── +page.svelte (landing page)
│   ├── signup/
│   │   ├── +page.svelte
│   │   └── +page.server.js (signup + Google OAuth actions)
│   ├── login/
│   │   ├── +page.svelte
│   │   └── +page.server.js (login + Google OAuth actions)
│   ├── logout/
│   │   ├── +page.svelte
│   │   └── +page.server.js
│   ├── confirm/
│   │   ├── +page.svelte (OTP entry)
│   │   └── +page.server.js (verify OTP)
│   ├── onboarding/
│   │   ├── +page.svelte
│   │   └── +page.server.js (save profile, send welcome email)
│   ├── forgot-password/
│   │   ├── +page.svelte
│   │   └── +page.server.js (generate reset link via Resend)
│   ├── update-password/
│   │   ├── +page.svelte
│   │   └── +page.server.js
│   ├── auth/callback/
│   │   └── +server.js (OAuth callback handler)
│   ├── demo/
│   │   ├── protected-full/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.js
│   │   └── protected-partial/
│   │       └── +page.svelte
│   └── admin/
│       ├── +layout.server.js (admin role check)
│       ├── +page.svelte (dashboard)
│       └── users/
│           ├── +page.svelte (user list)
│           └── +page.server.js (fetch users, reset password action)
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
```

#### 9. Environment Variables
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

#### 10. Design Requirements
- Premium dark/light mode using CSS variables
- HSL colors for primary (hue: 250), success (hue: 150), danger (hue: 0)
- Smooth transitions and hover effects
- Responsive design
- Clean, modern UI with cards, buttons, inputs
- Google Fonts (Inter or similar)

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

**Admin Access:**
- Create SQL function `is_admin()` with `SECURITY DEFINER` to check role
- Use this function in RLS policies to avoid infinite recursion
- Admin routes check role in `+layout.server.js`

**Resend Integration:**
- All emails sent via Resend API
- Include proper error handling
- Use verified domain in production (development allows only verified email)

#### 12. Documentation
Create:
- README.md (setup instructions, deployment guide)
- ADMIN_SETUP.md (how to make users admin)
- .env.example (template for environment variables)

#### 13. Additional Requirements
- No TypeScript
- No Tailwind CSS
- Clean, commented code
- Error handling on all forms
- Loading states on buttons
- Success/error alerts
- Favicon (SVG)
- SEO-friendly meta tags

## PROMPT END

---

## Usage Instructions

1. Copy the entire prompt above (from "PROMPT START" to "PROMPT END")
2. Paste it into a new conversation with an AI assistant
3. The assistant will build the complete system from scratch
4. Follow the setup instructions in the generated README.md

## Post-Generation Setup

After the system is generated:

1. **Install dependencies**: `npm install`
2. **Set up environment variables**: Copy `.env.example` to `.env` and fill in your keys
3. **Run Supabase SQL scripts**:
   - Run `supabase/schema.sql` in Supabase SQL Editor
   - Run `supabase/fix_rls.sql` to fix RLS recursion
4. **Enable Google OAuth** in Supabase Dashboard (if using)
5. **Verify domain in Resend** (for production email sending)
6. **Create first admin**: Update a user's role to 'admin' in Supabase Table Editor
7. **Run dev server**: `npm run dev`
8. **Deploy to Vercel**: Connect repo and add environment variables

## Notes

- This prompt captures the complete system as built in this conversation
- All security best practices are included
- The system is production-ready with proper RLS, auth validation, and email handling
- Resend requires domain verification for production use
