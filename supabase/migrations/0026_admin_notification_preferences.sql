alter table public.profiles
  add column if not exists admin_notify_new_orders boolean not null default true,
  add column if not exists admin_notify_cancellations boolean not null default true,
  add column if not exists admin_notify_payments boolean not null default true,
  add column if not exists admin_notify_shipping boolean not null default true;

comment on column public.profiles.admin_notify_new_orders is
  'Preferenza admin per notifiche relative ai nuovi ordini.';

comment on column public.profiles.admin_notify_cancellations is
  'Preferenza admin per notifiche relative alle richieste di annullamento.';

comment on column public.profiles.admin_notify_payments is
  'Preferenza admin per notifiche relative a pagamenti e rimborsi.';

comment on column public.profiles.admin_notify_shipping is
  'Preferenza admin per notifiche relative a spedizioni e problemi ordine.';


create or replace function public.sync_profile_email_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email
     and new.email is not null
  then
    update public.profiles
    set
      email = new.email,
      updated_at = now()
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated
on auth.users;

create trigger on_auth_user_email_updated
after update of email
on auth.users
for each row
execute function public.sync_profile_email_from_auth_user();
