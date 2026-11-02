begin;

create table public.palettes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (name = btrim(name) and char_length(name) between 3 and 25),
  colors text[] not null check (
    array_ndims(colors) = 1 and array_lower(colors, 1) = 1 and cardinality(colors) = 5
    and array_to_string(colors, ',') ~ '^#[0-9A-Fa-f]{6}(,#[0-9A-Fa-f]{6}){4}$'
  ),
  created_at timestamptz not null default now()
);

create unique index palettes_user_name_unique on public.palettes (user_id, lower(name));
alter table public.palettes enable row level security;

revoke all on table public.palettes from anon, authenticated;
grant select, insert on table public.palettes to authenticated;

create policy "Read own palettes" on public.palettes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save own palettes" on public.palettes
  for insert to authenticated with check ((select auth.uid()) = user_id);

commit;
