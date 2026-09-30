create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text check (description is null or char_length(description) <= 500),
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists todos_sort_order_idx on todos (sort_order);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists todos_updated_at on todos;
create trigger todos_updated_at before update on todos
  for each row execute function set_updated_at();

-- DEMO SECURITY MODEL: no auth, so anyone with the anon key can read/write.
-- Use only for demos. For real use, add a user_id column + Supabase Auth
-- and restrict these policies to auth.uid() = user_id.
alter table todos enable row level security;
drop policy if exists "demo_select" on todos;
drop policy if exists "demo_insert" on todos;
drop policy if exists "demo_update" on todos;
drop policy if exists "demo_delete" on todos;
create policy "demo_select" on todos for select to anon using (true);
create policy "demo_insert" on todos for insert to anon with check (true);
create policy "demo_update" on todos for update to anon using (true) with check (true);
create policy "demo_delete" on todos for delete to anon using (true);
