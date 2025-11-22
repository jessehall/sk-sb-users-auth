# SvelteKit + Supabase + Resend Auth System

A complete, production-ready authentication and user management system built with SvelteKit, Supabase, and Resend.

## 🚀 Features

### Authentication
- ✅ **Email/Password Signup** with OTP confirmation code (sent via Resend)
- ✅ **Email/Password Login**
- ✅ **Google OAuth (SSO)** for signup and login
- ✅ **Forgot Password** flow with reset link via email
- ✅ **Update Password** functionality
- ✅ **Logout** with session cleanup

### User Management
- ✅ **Onboarding Flow** - Collect user profile after signup (name, username, website)
- ✅ **Welcome Email** - Automatic email sent after profile completion
- ✅ **Profile Storage** - User data stored in Supabase with RLS policies
- ✅ **Auto Profile Creation** - Database trigger creates profile on signup

### Protected Routes
- ✅ **Full Protection** - Routes requiring authentication
- ✅ **Partial Protection** - Mixed public/private content
- ✅ **Server-side Auth** - Secure JWT validation on every request
- ✅ **Client-side Auth** - Real-time auth state management

### Admin System
- ✅ **Admin Dashboard** - Overview and management interface
- ✅ **User Management** - View all users, roles, and details
- ✅ **Password Reset** - Admins can reset any user's password
- ✅ **Delete Users** - Remove users from the system (with confirmation)
- ✅ **Role-based Access** - Admin-only routes protected by RLS

### Email System (Resend)
- ✅ **Signup Confirmation** - OTP code email
- ✅ **Welcome Email** - Sent after onboarding
- ✅ **Password Reset** - Recovery link email
- ✅ **Custom Templates** - HTML email templates

### Security
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **JWT Validation** - Server-side user verification
- ✅ **Secure Cookies** - HttpOnly, SameSite, Secure flags
- ✅ **CSRF Protection** - Built into SvelteKit
- ✅ **No Security Warnings** - Proper `getUser()` implementation
- ✅ **Admin Authorization** - Server-side role checks

### Design
- ✅ **Premium UI** - Modern, clean interface
- ✅ **Dark/Light Mode** - CSS variable-based theming
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **No Tailwind** - Pure CSS with utility classes
- ✅ **Smooth Animations** - Transitions and hover effects

## 📋 Available Routes

### Public Routes
- `/` - Landing page
- `/signup` - User registration (email/password or Google)
- `/login` - User login (email/password or Google)
- `/confirm` - Email confirmation (OTP entry)
- `/forgot-password` - Request password reset
- `/update-password` - Set new password (from reset link)
- `/auth/callback` - OAuth callback handler

### Protected Routes (Requires Login)
- `/onboarding` - Complete user profile after signup
- `/demo/protected-full` - Fully protected demo page
- `/demo/protected-partial` - Partially protected demo page
- `/logout` - Sign out

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/users` - User management (view, reset password, delete)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Resend account ([resend.com](https://resend.com))
- GitHub account (for deployment)

### Step 1: Clone and Install

```bash
git clone https://github.com/jessehall/sk-sb-users-auth.git
cd sk-sb-users-auth
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
```

**Where to find these:**
- **Supabase keys**: Project Settings → API
- **Resend API key**: API Keys → Create API Key

### Step 3: Supabase Database Setup

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Run the following scripts in order:

**a) Main Schema:**
```sql
-- Copy and paste contents of supabase/schema.sql
```

**b) RLS Fix (prevents recursion):**
```sql
-- Copy and paste contents of supabase/fix_rls.sql
```

**c) Add created_at column:**
```sql
-- Copy and paste contents of supabase/add_created_at.sql
```

### Step 4: Configure Supabase Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Enable **Google** provider (if using OAuth):
   - Add your Google Client ID and Secret
   - Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

4. Go to **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:5173` (development) or your production URL
   - Redirect URLs: Add `http://localhost:5173/auth/callback`

### Step 5: Configure Resend

1. Go to [resend.com/domains](https://resend.com/domains)
2. Verify your domain (for production)
3. Update `src/lib/email.js` with your verified email address:
   ```javascript
   from: 'Your Name <noreply@yourdomain.com>'
   ```

**Note:** In development, Resend only sends to your verified email address.

### Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Step 7: Create First Admin User

1. Sign up for an account at `/signup`
2. Complete the onboarding flow
3. Go to Supabase **Table Editor** → **profiles** table
4. Find your user and change `role` from `'user'` to `'admin'`
5. Log out and log back in
6. You can now access `/admin`

## 🚢 Deployment (Vercel)

### Option 1: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
6. Deploy

### Option 2: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and add environment variables when asked.

### Post-Deployment

1. Update Supabase **URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/auth/callback`

2. Update Google OAuth (if using):
   - Add `https://your-project.supabase.co/auth/v1/callback` to authorized redirect URIs

3. Update Resend `from` address to use your verified domain

## 📁 Project Structure

```
sk-sb-users-auth/
├── src/
│   ├── hooks.server.js              # Supabase SSR, auth validation
│   ├── app.html                     # HTML template
│   ├── routes/
│   │   ├── +layout.svelte           # Root layout (nav, auth state)
│   │   ├── +layout.server.js        # Pass user to client
│   │   ├── +page.svelte             # Landing page
│   │   ├── signup/
│   │   │   ├── +page.svelte         # Signup form
│   │   │   └── +page.server.js      # Signup + Google OAuth actions
│   │   ├── login/
│   │   │   ├── +page.svelte         # Login form
│   │   │   └── +page.server.js      # Login + Google OAuth actions
│   │   ├── logout/
│   │   │   ├── +page.svelte         # Logout page
│   │   │   └── +page.server.js      # Logout action
│   │   ├── confirm/
│   │   │   ├── +page.svelte         # OTP entry form
│   │   │   └── +page.server.js      # OTP verification
│   │   ├── onboarding/
│   │   │   ├── +page.svelte         # Profile form
│   │   │   └── +page.server.js      # Save profile, send welcome email
│   │   ├── forgot-password/
│   │   │   ├── +page.svelte         # Request reset form
│   │   │   └── +page.server.js      # Generate reset link
│   │   ├── update-password/
│   │   │   ├── +page.svelte         # New password form
│   │   │   └── +page.server.js      # Update password
│   │   ├── auth/callback/
│   │   │   └── +server.js           # OAuth callback handler
│   │   ├── demo/
│   │   │   ├── protected-full/
│   │   │   │   ├── +page.svelte     # Fully protected page
│   │   │   │   └── +page.server.js  # Auth check
│   │   │   └── protected-partial/
│   │   │       └── +page.svelte     # Partial protection
│   │   └── admin/
│   │       ├── +layout.server.js    # Admin role check
│   │       ├── +page.svelte         # Admin dashboard
│   │       └── users/
│   │           ├── +page.svelte     # User list UI
│   │           └── +page.server.js  # User management actions
│   ├── lib/
│   │   ├── email.js                 # Resend email helpers
│   │   └── server/
│   │       └── supabase-admin.js    # Admin Supabase client
│   └── styles/
│       └── global.css               # Global styles, CSS variables
├── static/
│   ├── favicon.svg                  # App icon
│   └── robots.txt                   # SEO
├── supabase/
│   ├── schema.sql                   # Database schema + RLS
│   ├── fix_rls.sql                  # RLS recursion fix
│   └── add_created_at.sql           # Migration script
├── .env.example                     # Environment template
├── README.md                        # This file
├── ADMIN_SETUP.md                   # Admin setup guide
├── RECREATION_PROMPT.md             # AI prompt to recreate project
├── package.json                     # Dependencies
├── svelte.config.js                 # SvelteKit config
└── vite.config.js                   # Vite config
```

## 🗄️ Database Schema

### profiles table
- `id` (uuid) - Foreign key to auth.users
- `created_at` (timestamp) - Account creation time
- `updated_at` (timestamp) - Last update time
- `username` (text, unique) - User's username
- `full_name` (text) - User's full name
- `avatar_url` (text) - Profile picture URL
- `website` (text) - User's website
- `email` (text) - User's email
- `role` (text) - 'user' or 'admin'

### audit_logs table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to auth.users
- `action` (text) - Action performed
- `details` (jsonb) - Additional data
- `created_at` (timestamp) - When action occurred

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only view/edit their own profile
- Admins can view all profiles
- Admins can view audit logs
- `is_admin()` function prevents RLS recursion

### Authentication
- JWT validation on every server request
- Secure session management via Supabase SSR
- No `getSession()` warnings (uses `getUser()`)
- HttpOnly cookies prevent XSS attacks

### Authorization
- Server-side role checks for admin routes
- Client-side guards for UX
- Database-level access control via RLS

## 📧 Email Templates

All emails are sent via Resend. Templates are in `src/lib/email.js`:

1. **Signup Confirmation** - OTP code
2. **Welcome Email** - After onboarding
3. **Password Reset** - Recovery link

Customize the HTML in each function to match your brand.

## 🐛 Troubleshooting

### "Missing +page.svelte component"
Make sure all route folders have both `+page.svelte` and `+page.server.js` files.

### "column profiles.created_at does not exist"
Run the `supabase/add_created_at.sql` migration in Supabase SQL Editor.

### Resend "validation_error"
In development, you can only send emails to your verified email address. Verify a domain for production use.

### Google OAuth not working
1. Check redirect URLs in Google Console and Supabase
2. Ensure Google provider is enabled in Supabase
3. Verify Client ID and Secret are correct

### Admin routes not accessible
1. Check your user's `role` in the profiles table
2. Make sure you logged out and back in after changing role
3. Verify RLS policies are applied (run `fix_rls.sql`)

## 📚 Additional Documentation

- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Detailed admin setup guide
- [RECREATION_PROMPT.md](./RECREATION_PROMPT.md) - AI prompt to recreate this project

## 🤝 Contributing

This is a starter template. Feel free to fork and customize for your needs!

## 📄 License

MIT

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Resend Documentation](https://resend.com/docs)

---

Built with ❤️ using SvelteKit, Supabase, and Resend
