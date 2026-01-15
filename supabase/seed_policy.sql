-- Allow all operations for public/anon users on menus table
-- Run this to enable the import script to work without authentication

-- Remove existing restrictive policies if they exist (or they might just coexist, but better to be clean)
drop policy if exists "Enable insert for authenticated users only" on public.menus;

-- Enable insert for everyone
create policy "Enable insert for everyone" on public.menus for insert with check (true);

-- Enable delete for everyone (so the script can clean up before inserting)
create policy "Enable delete for everyone" on public.menus for delete using (true);

-- Enable update for everyone
create policy "Enable update for everyone" on public.menus for update using (true);
