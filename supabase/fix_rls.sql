-- Fix infinite recursion in RLS policies

-- 1. Create a secure function to check if a user is an admin
-- This function runs with "security definer" privileges, bypassing RLS to avoid the recursion loop.
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Update profiles policy
-- We drop the old policy if it exists (ignoring error if it doesn't exactly match, but better to be precise)
-- Note: In SQL Editor, you might need to drop the specific policy name.
drop policy if exists "Profiles are viewable by users themselves or admins" on profiles;

create policy "Profiles are viewable by users themselves or admins" on profiles
  for select using (
    auth.uid() = id 
    or 
    is_admin()
  );

-- 3. Update audit_logs policy
drop policy if exists "Admins can view audit logs" on audit_logs;

create policy "Admins can view audit logs" on audit_logs
  for select using (
    is_admin()
  );
