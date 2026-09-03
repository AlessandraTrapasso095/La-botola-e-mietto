create type public.account_role as enum (
  'customer',
  'admin'
);

alter table public.profiles
  add column if not exists role public.account_role
  not null default 'customer';

create index if not exists profiles_role_idx
  on public.profiles (role)
  where deleted_at is null;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and deleted_at is null
  );
$$;

revoke all on function public.current_user_is_admin() from public;

grant execute on function public.current_user_is_admin()
to authenticated;
