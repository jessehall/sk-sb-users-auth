# Admin Setup Guide

## Making a User an Admin

### Method 1: Supabase Dashboard (Recommended for Development)

1. **Sign up** a user account through your app (or use an existing account)
2. Go to [Supabase Dashboard](https://supabase.com/dashboard)
3. Select your project
4. Navigate to **Table Editor** → **profiles** table
5. Find the user you want to make an admin
6. Click on the `role` cell for that user
7. Change the value from `user` to `admin`
8. Save the change
9. Have the user **log out and log back in**
10. They can now access `/admin`

### Method 2: SQL Query

Run this query in your Supabase SQL Editor:

```sql
-- Replace with the actual email address
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Method 3: Programmatically (Production)

For production, you might want to create an admin management system. Here's a sample SQL function:

```sql
-- Create a function to promote users to admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  
  -- Promote the user
  UPDATE profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Admin Access

### Login
- Admins use the **same login page** as regular users: `/login`
- No separate admin login is needed

### Admin Pages
- `/admin` - Admin Dashboard
- `/admin/users` - User Management (view users, reset passwords)

### Admin Features
- View all user profiles
- Reset user passwords (sends reset email via Resend)
- View audit logs (coming soon)

## Security Notes

- Admin role is protected by **Row Level Security (RLS)** policies
- Admin routes check the role on **both server and client side**
- Only users with `role = 'admin'` can access admin pages
- The `is_admin()` function uses `SECURITY DEFINER` to avoid RLS recursion

## First Admin Setup

For your very first admin (when no admins exist yet):

```sql
-- Run this ONCE in Supabase SQL Editor to create your first admin
-- Replace with your actual user's email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Resend Email Limitation (Development)

⚠️ **Important**: In development, Resend only allows sending emails to your verified email address.

To send emails to other users:
1. Go to [resend.com/domains](https://resend.com/domains)
2. Verify a domain you own
3. Update the `from` address in `src/lib/email.js` to use your verified domain
4. Example: Change `'Acme <onboarding@resend.dev>'` to `'Your App <noreply@yourdomain.com>'`
