-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Helper function to check admin status without recursion
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

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create policy "Profiles are viewable by users themselves or admins" on profiles
  for select using (
    auth.uid() = id 
    or 
    is_admin()
  );

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using (auth.uid() = owner) with check (bucket_id = 'avatars');

-- Admin Audit Log Table
create table audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table audit_logs enable row level security;

create policy "Admins can view audit logs" on audit_logs
  for select using (
    is_admin()
  );

create policy "System can insert audit logs" on audit_logs
  for insert with check (true);
