-- Create contacts table
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  message text not null,
  status text default 'new'
);

-- Enable RLS
alter table contacts enable row level security;

-- Policies
-- Only admins can view contacts
create policy "Admins can view contacts"
  on contacts for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Anyone can insert (for the contact form)
create policy "Anyone can insert contacts"
  on contacts for insert
  with check (true);
