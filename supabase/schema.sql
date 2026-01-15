-- Create menus table
-- Drop table if exists to ensure clean state
drop table if exists public.menus cascade;

-- Create menus table
create table public.menus (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  city text not null,
  meal_type text not null check (meal_type in ('Kahvaltı', 'Akşam')),
  content text not null, -- Stores food items as a simple string
  calories text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for menus
alter table public.menus enable row level security;

-- Allow read access to everyone for menus
create policy "Enable read access for all users" on public.menus
  for select using (true);

-- Allow write access only to authenticated users (or specific admin roles in future)
-- For now, allowing all authenticated users to insert for demo purposes
create policy "Enable insert for authenticated users only" on public.menus
  for insert with check (auth.role() = 'authenticated');


-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  food_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for favorites
alter table public.favorites enable row level security;

-- Allow users to view their own favorites
create policy "Users can view their own favorites" on public.favorites
  for select using (auth.uid() = user_id);

-- Allow users to insert their own favorites
create policy "Users can insert their own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

-- Allow users to delete their own favorites
create policy "Users can delete their own favorites" on public.favorites
  for delete using (auth.uid() = user_id);
